# -*- coding: utf-8 -*-
"""
Utilidades linguisticas compartidas: tokenizacion con lemas de dominio,
deteccion de preguntas, vectores tf-idf y clustering por lider.

Sin dependencias externas: solo biblioteca estandar, para que el pipeline
corra igual en cualquier maquina.
"""
from __future__ import annotations

import json
import math
import os
import re
from collections import Counter, defaultdict

import wa_lib as W

LEXICO = os.path.join(os.path.dirname(os.path.abspath(__file__)), "lexico_es.json")


class Lexico:
    def __init__(self, ruta: str = LEXICO):
        with open(ruta, encoding="utf-8") as fh:
            d = json.load(fh)
        self.stopwords = set(d["stopwords"])
        self.frases = {W.normalizar(k): v for k, v in d["frases"].items()}
        self.forma_a_lema: dict[str, str] = {}
        for lema, formas in d["lemas"].items():
            self.forma_a_lema[W.normalizar(lema).replace(" ", "_")] = lema
            for f in formas:
                self.forma_a_lema[W.normalizar(f).replace(" ", "_")] = lema
        self.senales_fuertes = [re.compile(p) for p in d["senales_fuertes"]]
        self.senales_debiles = [re.compile(p) for p in d["senales_debiles"]]
        self.interrogativos = set(d["interrogativos"])
        self.interrogativos_fuertes = set(d["interrogativos_fuertes"])
        self.excluir = [re.compile(p) for p in d["excluir_coordinacion"]]
        self.categorias = d["categorias"]
        self.peso_categoria = d["peso_categoria"]
        # frases mas largas primero
        self._frases_ord = sorted(self.frases, key=lambda f: -len(f))

    # -- tokenizacion -----------------------------------------------------
    def tokenizar(self, texto: str) -> list[str]:
        t = W.normalizar(texto).replace("?", " ")
        for frase in self._frases_ord:
            if frase in t:
                t = t.replace(frase, " " + self.frases[frase] + " ")
        salida: list[str] = []
        for tok in t.split():
            tok = tok.strip("_")
            if not tok or tok in self.stopwords:
                continue
            lema = self.forma_a_lema.get(tok)
            if lema:
                salida.append(lema)
                continue
            if len(tok) < 4 or tok.isdigit():
                continue
            salida.append(self._despluralizar(tok))
        return salida

    @staticmethod
    def _despluralizar(tok: str) -> str:
        if len(tok) > 5 and tok.endswith("es") and not tok.endswith("ses"):
            return tok[:-2]
        if len(tok) > 4 and tok.endswith("s") and not tok.endswith("ss"):
            return tok[:-1]
        return tok

    # -- deteccion de duda -------------------------------------------------
    def senales_de_duda(self, texto: str) -> tuple[list[str], list[str]]:
        """(senales fuertes, senales debiles).

        Solo las fuertes alcanzan para declarar que el mensaje plantea una duda.
        En castellano "que", "porque" o "hay que" abren tanto una pregunta como
        una respuesta, asi que por si solas no cuentan.
        """
        # Las URLs traen "?" y "&" y disparan falsas senales de pregunta.
        limpio = re.sub(r"https?://\S+|www\.\S+", " ", W.limpiar_invisibles(texto))
        base = W.normalizar(limpio)
        crudo = limpio.lower()
        fuertes, debiles = [], []
        if "?" in crudo or "¿" in crudo:
            fuertes.append("signo_pregunta")
        for rx in self.senales_fuertes:
            if rx.pattern in (r"\?", "¿"):
                continue
            if rx.search(base):
                fuertes.append(rx.pattern.replace("\\b", "").strip())
        primera = (base.split() or [""])[0]
        if primera in self.interrogativos_fuertes:
            fuertes.append("empieza_interrogativo")
        for rx in self.senales_debiles:
            if rx.search(base):
                debiles.append(rx.pattern.replace("\\b", "").strip())
        return fuertes, debiles

    def es_coordinacion(self, texto: str) -> bool:
        base = W.normalizar(texto)
        crudo = W.limpiar_invisibles(texto).lower()
        return any(rx.search(base) or rx.search(crudo) for rx in self.excluir)

    # -- categorizacion ----------------------------------------------------
    def categorizar(self, tokens: list[str]) -> tuple[str, dict]:
        cuenta = Counter(tokens)
        puntajes: dict[str, float] = {}
        for cat, claves in self.categorias.items():
            p = sum(cuenta[k] for k in claves)
            if p:
                puntajes[cat] = p * self.peso_categoria.get(cat, 1.0)
        if not puntajes:
            return "dudas generales sobre el ingreso democrático", {}
        mejor = max(puntajes, key=lambda c: puntajes[c])
        return mejor, puntajes


# --------------------------------------------------------------------------
# tf-idf + clustering por lider
# --------------------------------------------------------------------------
def construir_vectores(
    docs: list[list[str]],
    conceptos: set[str] | None = None,
    refuerzo: float = 1.6,
    tope_tokens: int = 12,
) -> tuple[list[dict], dict]:
    """tf-idf normalizado.

    `conceptos` son los lemas de dominio: pesan mas que una palabra cualquiera,
    porque son los que dicen de que trata la duda. `tope_tokens` recorta la cola
    de cada mensaje para que un planteo largo y divagante no se diluya.
    """
    conceptos = conceptos or set()
    n = len(docs)
    df = Counter()
    for toks in docs:
        df.update(set(toks))
    idf = {t: math.log((n + 1) / (d + 1)) + 1.0 for t, d in df.items()}
    vectores = []
    for toks in docs:
        tf = Counter(toks)
        v = {
            t: (1 + math.log(c)) * idf[t] * (refuerzo if t in conceptos else 1.0)
            for t, c in tf.items()
        }
        if len(v) > tope_tokens:
            v = dict(sorted(v.items(), key=lambda kv: -kv[1])[:tope_tokens])
        norma = math.sqrt(sum(x * x for x in v.values())) or 1.0
        vectores.append({t: x / norma for t, x in v.items()})
    return vectores, df


def centroide(indices: list[int], vectores: list[dict]) -> dict:
    acc: dict[str, float] = defaultdict(float)
    for i in indices:
        for t, x in vectores[i].items():
            acc[t] += x
    norma = math.sqrt(sum(x * x for x in acc.values())) or 1.0
    return {t: x / norma for t, x in acc.items()}


def lider_central(
    indices: list[int], vectores: list[dict], textos: list[str],
    largo_min: int = 25, largo_max: int = 240,
) -> int:
    """El representante del cluster es el planteo mas central y mas legible,
    no el mas largo: un mensaje que divaga arrastra el resto del hilo."""
    c = centroide(indices, vectores)
    def puntaje(i: int) -> float:
        t = textos[i]
        p = coseno(c, vectores[i])
        if largo_min <= len(t) <= largo_max:
            p += 0.15
        if "?" in t:
            p += 0.08
        if len(t) > 400:
            p -= 0.25
        return p
    return max(indices, key=puntaje)


def indice_invertido(vectores: list[dict], df: Counter, tope_df: float = 0.25) -> dict:
    n = len(vectores)
    limite = max(3, int(n * tope_df))
    idx = defaultdict(list)
    for i, v in enumerate(vectores):
        for t in v:
            if df[t] <= limite:
                idx[t].append(i)
    return idx


def coseno(a: dict, b: dict) -> float:
    if len(a) > len(b):
        a, b = b, a
    return sum(x * b.get(t, 0.0) for t, x in a.items())


def candidatos(i: int, vectores: list[dict], idx: dict, tope: int = 3000) -> set[int]:
    v = vectores[i]
    fuertes = sorted(v, key=lambda t: -v[t])[:8]
    out: set[int] = set()
    for t in fuertes:
        lista = idx.get(t)
        if not lista or len(lista) > tope:
            continue
        out.update(lista)
    out.discard(i)
    return out


def agrupar_por_lider(
    vectores: list[dict], orden: list[int], umbral: float, idx: dict
) -> list[dict]:
    """Cada documento sin asignar se vuelve lider y absorbe a los parecidos.

    Evita el encadenamiento de las componentes conexas: un miembro solo entra
    si se parece al lider, no a un miembro cualquiera del grupo.
    """
    asignado: dict[int, int] = {}
    clusters: list[dict] = []
    for i in orden:
        if i in asignado:
            continue
        cid = len(clusters)
        grupo = {"lider": i, "miembros": [i], "similitudes": {i: 1.0}}
        asignado[i] = cid
        for j in candidatos(i, vectores, idx):
            if j in asignado:
                continue
            s = coseno(vectores[i], vectores[j])
            if s >= umbral:
                asignado[j] = cid
                grupo["miembros"].append(j)
                grupo["similitudes"][j] = round(s, 3)
        clusters.append(grupo)
    return clusters


def fusionar_clusters(
    clusters: list[dict], vectores: list[dict], umbral: float
) -> list[dict]:
    """Segunda pasada: absorbe clusters casi identicos.

    Deliberadamente sin transitividad. Con union-find, A~B y B~C terminan
    arrastrando a C junto a A aunque no se parezcan, y de ahi salen esos
    clusters gigantes que mezclan medio chat. Aca cada cluster se compara
    contra los que ya quedaron firmes, y se funde con el mejor si lo supera.
    """
    orden = sorted(range(len(clusters)), key=lambda i: -len(clusters[i]["miembros"]))
    centroides = {i: centroide(clusters[i]["miembros"], vectores) for i in orden}

    firmes: list[int] = []
    destino: dict[int, int] = {}
    for i in orden:
        mejor, mejor_sim = None, 0.0
        for j in firmes:
            s = coseno(centroides[i], centroides[j])
            if s > mejor_sim:
                mejor, mejor_sim = j, s
        if mejor is not None and mejor_sim >= umbral:
            destino[i] = mejor
        else:
            firmes.append(i)
            destino[i] = i

    fusionados: dict[int, dict] = {}
    for i, c in enumerate(clusters):
        d = destino[i]
        acc = fusionados.setdefault(
            d, {"lider": clusters[d]["lider"], "miembros": [], "similitudes": {}}
        )
        acc["miembros"].extend(c["miembros"])
        acc["similitudes"].update(c["similitudes"])
    return list(fusionados.values())
