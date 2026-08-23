# -*- coding: utf-8 -*-
"""
Libreria compartida del pipeline de extraccion de FAQs a partir de exports
de WhatsApp. Todo esta parametrizado por organismo (ver scripts/organismos.json):
el mismo codigo corre para MPF y para MPD cambiando solo --organismo.

No contiene nada especifico del MPF.
"""
from __future__ import annotations

import glob
import json
import os
import re
import unicodedata

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONFIG = os.path.join(os.path.dirname(os.path.abspath(__file__)), "organismos.json")


# --------------------------------------------------------------------------
# Configuracion
# --------------------------------------------------------------------------
def cargar_organismo(codigo: str) -> dict:
    with open(CONFIG, encoding="utf-8") as fh:
        conf = json.load(fh)
    codigo = codigo.upper()
    if codigo not in conf:
        raise SystemExit(
            f"Organismo '{codigo}' no definido. Disponibles: {', '.join(sorted(conf))}"
        )
    org = dict(conf[codigo])
    org["codigo"] = codigo
    return org


def archivos_entrada(org: dict) -> list[str]:
    rutas: list[str] = []
    for patron in org["entradas"]:
        rutas.extend(sorted(glob.glob(os.path.join(RAIZ, patron))))
    if not rutas:
        raise SystemExit(
            f"No hay archivos de entrada para {org['codigo']} en {org['entradas']}"
        )
    return rutas


# --------------------------------------------------------------------------
# Normalizacion de texto
# --------------------------------------------------------------------------
INVISIBLES = dict.fromkeys(
    [0x200E, 0x200F, 0x200B, 0x200C, 0x200D, 0x2066, 0x2067, 0x2068, 0x2069, 0xFEFF]
)
ESPACIOS_RAROS = {0x00A0: " ", 0x202F: " ", 0x2007: " ", 0x2009: " "}

# rangos de emoji / pictogramas / simbolos decorativos
EMOJI = re.compile(
    "[\U0001F000-\U0001FAFF\U00002190-\U000021FF\U00002300-\U000027BF"
    "\U00002B00-\U00002BFF\U0001F1E6-\U0001F1FF\U0000FE00-\U0000FE0F"
    "\U000024C2\U00003030\U0000303D\U00002049\U0000203C\U00002122\U00002139]+"
)


def limpiar_invisibles(texto: str) -> str:
    texto = texto.translate(INVISIBLES).translate(ESPACIOS_RAROS)
    return texto


def normalizar(texto: str) -> str:
    """minusculas, sin tildes, sin emoji, sin puntuacion: para comparar."""
    texto = limpiar_invisibles(texto).lower()
    texto = EMOJI.sub(" ", texto)
    texto = "".join(
        c for c in unicodedata.normalize("NFD", texto) if unicodedata.category(c) != "Mn"
    )
    texto = re.sub(r"[^a-z0-9ñ\s\?]", " ", texto)
    return re.sub(r"\s+", " ", texto).strip()


# --------------------------------------------------------------------------
# Parseo del export
# --------------------------------------------------------------------------
# Formatos soportados (WhatsApp cambia segun sistema operativo e idioma).
FORMATOS = [
    # iOS:  [14/12/25, 14:34:58] Autor: texto
    re.compile(
        r"^\[(?P<fecha>\d{1,2}/\d{1,2}/\d{2,4}),\s*"
        r"(?P<hora>\d{1,2}:\d{2}(?::\d{2})?(?:\s*[ap]\.?\s*m\.?)?)\]\s*"
        r"(?P<autor>[^:]{1,80}?):\s?(?P<texto>.*)$",
        re.IGNORECASE,
    ),
    # Android: 14/12/25, 14:34 - Autor: texto
    re.compile(
        r"^(?P<fecha>\d{1,2}/\d{1,2}/\d{2,4}),?\s+"
        r"(?P<hora>\d{1,2}:\d{2}(?::\d{2})?(?:\s*[ap]\.?\s*m\.?)?)\s*[-–]\s*"
        r"(?P<autor>[^:]{1,80}?):\s?(?P<texto>.*)$",
        re.IGNORECASE,
    ),
]
# Lineas de sistema sin autor (Android): "14/12/25, 14:34 - Creaste el grupo"
SIN_AUTOR = [
    re.compile(r"^\[(?P<fecha>\d{1,2}/\d{1,2}/\d{2,4}),\s*(?P<hora>[\d:]+)\]\s*(?P<texto>.*)$"),
    re.compile(
        r"^(?P<fecha>\d{1,2}/\d{1,2}/\d{2,4}),?\s+(?P<hora>[\d:]+)\s*[-–]\s*(?P<texto>.*)$"
    ),
]


def _iso(fecha: str, hora: str) -> str:
    d, m, a = fecha.split("/")
    a = a.strip()
    if len(a) == 2:
        a = "20" + a
    hora = hora.strip().lower()
    sufijo = None
    if re.search(r"[ap]\.?\s*m\.?", hora):
        sufijo = "pm" if "p" in hora.split(":")[-1] else "am"
        hora = re.sub(r"\s*[ap]\.?\s*m\.?", "", hora).strip()
    partes = hora.split(":")
    while len(partes) < 3:
        partes.append("00")
    hh, mm, ss = (int(p) for p in partes[:3])
    if sufijo == "pm" and hh < 12:
        hh += 12
    if sufijo == "am" and hh == 12:
        hh = 0
    return f"{int(a):04d}-{int(m):02d}-{int(d):02d}T{hh:02d}:{mm:02d}:{ss:02d}"


def parsear_export(ruta: str) -> list[dict]:
    """Devuelve los mensajes crudos del archivo, uniendo lineas de continuacion."""
    with open(ruta, encoding="utf-8", errors="replace") as fh:
        contenido = fh.read().replace("\r\n", "\n")

    mensajes: list[dict] = []
    actual: dict | None = None
    for linea in contenido.split("\n"):
        base = limpiar_invisibles(linea)
        encontrado = None
        for rx in FORMATOS:
            m = rx.match(base)
            if m:
                encontrado = m
                break
        if encontrado:
            if actual:
                mensajes.append(actual)
            g = encontrado.groupdict()
            actual = {
                "timestamp": _iso(g["fecha"], g["hora"]),
                "autor": g["autor"].strip().lstrip("~").strip(),
                "texto": g["texto"],
            }
            continue
        sistema = None
        for rx in SIN_AUTOR:
            m = rx.match(base)
            if m:
                sistema = m
                break
        if sistema:
            if actual:
                mensajes.append(actual)
            g = sistema.groupdict()
            actual = {
                "timestamp": _iso(g["fecha"], g["hora"]),
                "autor": "",
                "texto": g["texto"],
            }
            continue
        if actual is not None:
            actual["texto"] += "\n" + base
    if actual:
        mensajes.append(actual)
    return mensajes


# --------------------------------------------------------------------------
# Clasificacion de ruido
# --------------------------------------------------------------------------
FRASES_SISTEMA = [
    r"se uni[oó] (con el enlace del grupo|usando el enlace de invitaci[oó]n|al grupo)",
    r"sali[oó] del grupo",
    r"a[ñn]adi[oó] a\b",
    r"te a[ñn]adi[oó]",
    r"elimin[oó] a\b",
    r"cre[oó] el grupo",
    r"creaste el grupo",
    r"cambi[oó] (el asunto|el nombre del grupo|la descripci[oó]n del grupo|el [ií]cono del grupo|la imagen de este grupo|su n[uú]mero de tel[eé]fono)",
    r"cambiaste (el asunto|la descripci[oó]n del grupo|el [ií]cono del grupo)",
    r"(los mensajes y las llamadas est[aá]n cifrados|est[aá]n protegidos con el cifrado)",
    r"cambi[oó] el c[oó]digo de seguridad",
    r"ahora es administrador",
    r"activ[oó] los mensajes temporales",
    r"desactiv[oó] los mensajes temporales",
    r"a[ñn]adi[oó] el grupo a la comunidad",
    r"se uni[oó] usando",
    r"se unieron",
    r"^tu c[oó]digo de seguridad",
    r"solo los administradores pueden",
    r"fij[oó] un mensaje",
    r"^se elimin[oó] este mensaje",
    r"^este mensaje fue eliminado",
    r"^eliminaste este mensaje",
    r"^se elimin[oó] el mensaje",
    r"^esperando este mensaje",
    r"cambi[oó] los ajustes",
    r"cambi[oó] la configuraci[oó]n del grupo",
    r"los ajustes de este grupo",
    r"ahora (eres|sos) administrador",
    r"te sac[oó] del grupo",
    r"sali[oó] de la comunidad",
    r"a[ñn]adi[oó] este grupo a la comunidad",
    r"^se uni[oó]",
]
RX_SISTEMA = [re.compile(p, re.IGNORECASE) for p in FRASES_SISTEMA]

RX_MULTIMEDIA = re.compile(
    r"<?\s*(?:im[aá]gen|imagen|foto|v[ií]deo|video|audio|sticker|gif|documento|"
    r"tarjeta de contacto|archivo|ubicaci[oó]n|nota de voz)\s*"
    r"(?:omitid[oa]s?|adjunt[oa]s?)\s*>?",
    re.IGNORECASE,
)
RX_MULTIMEDIA_ALT = re.compile(
    r"<\s*multimedia\s+omitido\s*>|\bmultimedia omitido\b|\bse omiti[oó] el archivo\b",
    re.IGNORECASE,
)
RX_EDITADO = re.compile(r"<\s*se edit[oó] este mensaje\s*>|<\s*este mensaje fue editado\s*>", re.IGNORECASE)
RX_ENCUESTA = re.compile(r"^\s*encuesta:", re.IGNORECASE)

# Palabras que, solas o combinadas, no aportan informacion.
TOKENS_VACIOS = {
    "gracias", "graciass", "graciasss", "gracias!", "grax", "grcs", "mil", "muchas",
    "muchisimas", "much", "totales", "genia", "genio", "genial", "crack", "capo",
    "hola", "holaa", "holis", "buenas", "buen", "buenos", "buenas!", "dia", "dias",
    "tardes", "noches", "chicos", "chicas", "gente", "todos", "todas", "ok", "oka",
    "okey", "dale", "listo", "perfecto", "perfec", "barbaro", "excelente", "joya",
    "buenisimo", "buenisima", "si", "sii", "no", "noo", "ah", "aa", "jaja", "jajaja",
    "jajajaja", "jeje", "ja", "ay", "uf", "ufa", "obvio", "igualmente", "abrazo",
    "saludos", "suerte", "exitos", "exito", "felicitaciones", "felicidades", "amen",
    "por", "el", "la", "los", "las", "de", "del", "a", "y", "que", "info", "dato",
    "aporte", "gracia", "graciaas", "tal", "cual", "bien", "bueno", "buena", "arriba",
    "vamos", "aguante", "nada", "denada", "figuras", "tambien", "yo", "mi", "tu",
    "sisi", "aja", "claro", "entiendo", "ya", "esta", "estamos", "bienvenidos",
    "bienvenida", "bienvenido", "feliz", "navidad", "anio", "nuevo", "fiestas",
    "bendiciones", "corazon", "gente!", "grupo", "buendia",
}


def clasificar_ruido(texto_limpio: str, autor: str) -> str | None:
    """Devuelve el motivo de descarte, o None si el mensaje se conserva."""
    crudo = texto_limpio.strip()
    if not crudo:
        return "vacio"

    # Los avisos de sistema arrancan con el nombre de quien los provoco, asi que
    # la frase clave siempre cae al principio del mensaje.
    if not crudo.rstrip().endswith("?"):
        for rx in RX_SISTEMA:
            m = rx.search(crudo)
            if m and m.start() < 120:
                return "sistema"

    if RX_ENCUESTA.search(crudo):
        return "encuesta"

    sin_media = RX_MULTIMEDIA_ALT.sub(" ", RX_MULTIMEDIA.sub(" ", crudo))
    sin_media = RX_EDITADO.sub(" ", sin_media).strip()
    if not sin_media:
        return "multimedia"

    norm = normalizar(sin_media)
    if not norm:
        return "solo_emoji"

    if "?" not in sin_media and len(sin_media) <= 60:
        tokens = [t for t in norm.replace("?", " ").split() if t]
        if tokens and all(
            t in TOKENS_VACIOS or re.fullmatch(r"(?:ja|je|ha|s|a|o|k|x)+", t) for t in tokens
        ):
            return "cortesia"

    if len(norm) < 3:
        return "muy_corto"
    return None


def limpiar_para_salida(texto: str) -> str:
    """Saca placeholders de multimedia y marcas de edicion del texto publicable."""
    t = RX_MULTIMEDIA_ALT.sub(" ", RX_MULTIMEDIA.sub(" ", texto))
    t = RX_EDITADO.sub(" ", t)
    t = re.sub(r"[ \t]+", " ", t)
    t = re.sub(r"\n{3,}", "\n\n", t)
    return t.strip()


# --------------------------------------------------------------------------
# Anonimizacion
# --------------------------------------------------------------------------
RX_MAIL = re.compile(r"[\w.+-]+@[\w-]+(?:\.[\w-]+)+", re.IGNORECASE)
RX_MAIL_SUELTO = re.compile(r"@(?:gmail|hotmail|outlook|yahoo|live|icloud)\.[\w.]+", re.IGNORECASE)
RX_TEL = re.compile(
    r"(?<![$\d])(?:\+?\s?54\s?9?[\s.\-]?)?(?:\(?\d{2,4}\)?[\s.\-]?)?\d{3,4}[\s.\-]?\d{4}\b(?![\d.,])"
)
RX_CUIL = re.compile(r"\b\d{2}[\s.\-]?\d{8}[\s.\-]?\d\b")
RX_DOC_CONTEXTO = re.compile(
    r"\b(dni|d\.n\.i\.?|documento|cuil|cuit|legajo|tr[aá]mite n[°ºo]?)\b[\s:.\-n°ºNro]{0,12}\d[\d.\s\-]{5,12}",
    re.IGNORECASE,
)
RX_DOC_SUELTO = re.compile(r"(?<![$\d.,])\b(?:\d{1,2}\.\d{3}\.\d{3}|\d{7,8})\b(?![\d.,])")
RX_MENCION = re.compile(r"@([A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9._\- ]{2,40})")

PALABRAS_NO_NOMBRE = {
    "examen", "nexo", "mpf", "mpd", "fiscal", "defensa", "ministerio", "concurso",
    "ingreso", "democratico", "inscripcion", "the", "king", "kings", "forever",
    "info", "ayuda", "estudio", "test", "word", "excel", "pdf", "zoom", "meet",
    "whatsapp", "telegram", "instagram", "admin", "administrador", "moderador",
}


def _cargar_palabras_comunes() -> set[str]:
    """Vocabulario castellano que nunca debe redactarse como nombre propio."""
    ruta = os.path.join(os.path.dirname(os.path.abspath(__file__)), "palabras_comunes_es.txt")
    palabras: set[str] = set()
    try:
        with open(ruta, encoding="utf-8") as fh:
            for linea in fh:
                linea = linea.split("#")[0]
                for token in linea.split():
                    if token:
                        palabras.add(token.lower())
    except FileNotFoundError:
        pass
    return palabras


PALABRAS_COMUNES = _cargar_palabras_comunes() | PALABRAS_NO_NOMBRE


class Anonimizador:
    """Asigna identificadores estables A0001... y borra datos personales."""

    def __init__(self, ancho: int = 4):
        self.ancho = ancho
        self.por_autor: dict[str, str] = {}
        self.orden: list[str] = []
        self.contadores = {
            "mail": 0, "telefono": 0, "documento": 0, "mencion": 0, "nombre": 0,
        }
        self._rx_nombres = None

    def clave(self, autor: str) -> str:
        autor = autor.strip()
        if autor not in self.por_autor:
            self.por_autor[autor] = f"A{len(self.por_autor) + 1:0{self.ancho}d}"
            self.orden.append(autor)
        return self.por_autor[autor]

    # -- nombres de participantes dentro del texto -------------------------
    def compilar_nombres(self) -> None:
        piezas: list[tuple[str, str]] = []
        self.tokens_descartados: list[str] = []
        for autor, hash_ in self.por_autor.items():
            limpio = limpiar_invisibles(autor)
            limpio = re.split(r"[|(]", limpio)[0]
            limpio = EMOJI.sub(" ", limpio).strip()
            partes = [p.strip(".,-_·") for p in re.split(r"\s+", limpio) if p.strip(".,-_·")]
            # Un alias tipo "EOE EP 120 SOLO MSJ NO AUDIO" o "alguna vez fui feliz"
            # no es un nombre: de esos solo se redacta la cadena completa.
            alias_frase = len(partes) >= 5 or any(re.search(r"\d", p) for p in partes)
            if not alias_frase:
                for parte in partes:
                    if len(parte) < 4 or not re.fullmatch(r"[A-Za-zÁÉÍÓÚÜÑáéíóúüñ'´`]+", parte):
                        continue
                    norma = normalizar(parte)
                    if norma in PALABRAS_COMUNES or re.fullmatch(r"(.)\1+", norma):
                        self.tokens_descartados.append(norma)
                        continue
                    piezas.append((parte, hash_))
            entero = re.sub(r"\s+", " ", limpio).strip()
            if len(entero) >= 6 and " " in entero:
                piezas.append((entero, hash_))
        # los nombres mas largos primero para no partirlos
        piezas.sort(key=lambda p: -len(p[0]))
        self._nombres = piezas
        vistos: set[str] = set()
        alternativas = []
        self._destino: dict[str, str] = {}
        for texto, hash_ in piezas:
            k = normalizar(texto)
            if not k or k in vistos:
                continue
            vistos.add(k)
            alternativas.append(re.escape(texto))
            self._destino[k] = hash_
        if alternativas:
            self._rx_nombres = re.compile(
                r"(?<![\wÁÉÍÓÚÜÑáéíóúüñ])(" + "|".join(alternativas) + r")(?![\wÁÉÍÓÚÜÑáéíóúüñ])",
                re.IGNORECASE,
            )

    def _sub_nombre(self, m: re.Match) -> str:
        destino = self._destino.get(normalizar(m.group(1)))
        if not destino:
            return m.group(0)
        self.contadores["nombre"] += 1
        return f"[{destino}]"

    # -- limpieza principal ------------------------------------------------
    def limpiar_texto(self, texto: str) -> str:
        def cnt(clave, rx, repl, t):
            nuevo, n = rx.subn(repl, t)
            self.contadores[clave] += n
            return nuevo

        # 1. las URLs se preservan tal cual (material de estudio, sitios oficiales)
        urls: list[str] = []

        def guardar(m):
            urls.append(m.group(0))
            return f"\x00URL{len(urls) - 1}\x00"

        t = re.sub(r"https?://\S+|www\.\S+", guardar, texto)

        # 2. datos personales
        t = cnt("mail", RX_MAIL, "[MAIL]", t)
        t = cnt("mail", RX_MAIL_SUELTO, "[MAIL]", t)

        def sub_mencion(m):
            destino = self._destino.get(normalizar(m.group(1))) if hasattr(self, "_destino") else None
            self.contadores["mencion"] += 1
            return f"[{destino}]" if destino else "[MENCION]"

        t = RX_MENCION.sub(sub_mencion, t)
        t = cnt("documento", RX_CUIL, "[CUIL]", t)
        t = cnt("documento", RX_DOC_CONTEXTO, "[DOCUMENTO]", t)
        t = cnt("telefono", RX_TEL, "[TEL]", t)
        t = cnt("documento", RX_DOC_SUELTO, "[DOCUMENTO]", t)

        # 3. nombres de participantes escritos dentro del mensaje
        if self._rx_nombres is not None:
            t = self._rx_nombres.sub(self._sub_nombre, t)

        for i, u in enumerate(urls):
            t = t.replace(f"\x00URL{i}\x00", u)
        return t

    def mapeo(self) -> dict:
        import hashlib

        return {
            "descripcion": "Mapeo autor real -> autor_hash. NO publicar. Fuera del output.",
            "autores": [
                {
                    "autor_hash": self.por_autor[a],
                    "nombre_en_export": a,
                    "sha256": hashlib.sha256(normalizar(a).encode()).hexdigest()[:16],
                }
                for a in self.orden
            ],
        }


# --------------------------------------------------------------------------
# Utilidades de E/S
# --------------------------------------------------------------------------
def escribir_jsonl(ruta: str, filas) -> int:
    os.makedirs(os.path.dirname(ruta), exist_ok=True)
    n = 0
    with open(ruta, "w", encoding="utf-8") as fh:
        for fila in filas:
            fh.write(json.dumps(fila, ensure_ascii=False) + "\n")
            n += 1
    return n


def leer_jsonl(ruta: str) -> list[dict]:
    with open(ruta, encoding="utf-8") as fh:
        return [json.loads(l) for l in fh if l.strip()]
