/**
 * Un Supabase de juguete, sólo para recorrer el flujo de punta a punta.
 *
 * El proyecto real tiene la confirmación por correo prendida, así que un alta
 * nueva nunca devuelve sesión y no hay forma de ver las pantallas de adentro.
 * Esto implementa lo mínimo que usa @supabase/ssr —alta, ingreso, /user,
 * refresh, logout— más los pedazos de PostgREST que toca la app. Todo en
 * memoria: se apaga y no queda nada.
 *
 * NO VALIDA NADA: no hay RLS, no hay permisos por columna, no hay tokens de
 * verdad. Sirve para mirar pantallas. La seguridad se prueba contra un
 * PostgreSQL real, con supabase/pruebas/.
 */
import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

const usuarios = new Map();   // email -> { id, email, clave }
const porToken = new Map();   // access_token -> user_id
const perfiles = new Map();   // user_id -> fila

const log = [];
const usuarioDe = (req) => porToken.get((req.headers.authorization || '').replace(/^Bearer /, ''));

// ============================================================
// Las tablas
//
// Los exámenes son los mismos cuatro que crea la migración 0005, con los
// mismos números. Las preguntas salen de los JSON del repositorio.
// ============================================================
const idConcurso = { mpd: randomUUID(), mpf: randomUUID() };

const tablas = {
  concursos: [
    { id: idConcurso.mpd, organismo: 'mpd', cargo: 'Técnico administrativo', anio: 2026, estado: 'sin_convocatoria' },
    { id: idConcurso.mpf, organismo: 'mpf', cargo: 'Técnico administrativo', anio: 2026, estado: 'finalizado' },
  ],
  exams: [],
  questions: [],
  attempts: [],
  attempt_answers: [],
};

for (const [org, titulo, instancia, modalidad, duracion, cantidad, correcta, incorrecta, inicial] of [
  ['mpf', 'Examen teórico', 'teorico', 'multiple_choice', 30, 20, 5, -5, 0],
  ['mpf', 'Examen práctico', 'practico', 'investigacion', 15, 10, 10, -10, 0],
  ['mpd', 'Examen teórico', 'teorico', 'multiple_choice', 30, 10, 10, -10, 0],
  ['mpd', 'Examen práctico de tipeo', 'practico', 'tipeo', 30, 1, 0, -5, 100],
]) {
  tablas.exams.push({
    id: randomUUID(), concurso_id: idConcurso[org], titulo, instancia, modalidad,
    duracion_minutos: duracion, cantidad_preguntas: cantidad,
    puntos_correcta: correcta, puntos_incorrecta: incorrecta, puntos_blanco: 0,
    puntaje_inicial: inicial, puntaje_minimo: 60, publicado: true, revisado: true,
    // PostgREST devuelve el embebido como objeto; la app lee fila.concursos.organismo.
    concursos: { organismo: org },
  });
}

const examenDe = (org, instancia, modalidad) =>
  tablas.exams.find((e) => e.concursos.organismo === org && e.instancia === instancia && e.modalidad === modalidad);

const DESTINO = {
  'mpd/teorico': ['mpd', 'teorico', 'multiple_choice'],
  'mpf/teorico': ['mpf', 'teorico', 'multiple_choice'],
  'mpf/practico': ['mpf', 'practico', 'investigacion'],
};

/**
 * Cuántas preguntas de cada examen se dan por revisadas.
 *
 * Por defecto NINGUNA, que es el estado real del proyecto: las 259 están sin
 * revisar y el simulador no tiene que mostrar ninguna. Con BANCO_REVISADAS=30
 * se marcan las primeras treinta de cada examen, que es lo que permite mirar
 * las pantallas de rendir y de resultados.
 */
const REVISADAS = Number.parseInt(process.env.BANCO_REVISADAS ?? '0', 10) || 0;

/** BANCO_REVISOR=1 hace revisora a cualquier cuenta, para poder ver /revisar. */
const ROL = process.env.BANCO_REVISOR ? 'revisor' : 'persona';

/**
 * Temas de mentira, para poder MIRAR el desglose por tema de la pantalla de
 * resultados. Ninguna de las 259 preguntas del repositorio tiene tema
 * cargado, así que sin esto esa sección no se puede ver andando: no se
 * renderiza, que es lo correcto pero no se puede revisar.
 *
 *   BANCO_TEMAS=1 node tests/banco/supabase-falso.mjs
 */
const TEMAS = process.env.BANCO_TEMAS
  ? ['Constitucional', 'Ley Orgánica', 'Ética y transparencia', 'Procesal penal']
  : [];

const dirJson = resolve(RAIZ, 'material/preguntas/json');
const porExamen = new Map();
for (const archivo of readdirSync(dirJson).sort()) {
  for (const q of JSON.parse(readFileSync(resolve(dirJson, archivo), 'utf8'))) {
    const destino = DESTINO[`${q.organismo}/${q.seccion}`];
    if (!destino) continue;
    const examen = examenDe(...destino);
    const cuantas = porExamen.get(examen.id) ?? 0;
    porExamen.set(examen.id, cuantas + 1);
    tablas.questions.push({
      id: randomUUID(), exam_id: examen.id, orden: cuantas + 1,
      enunciado: q.enunciado, tipo: 'multiple_choice', opciones: q.opciones,
      respuesta_correcta: q.respuesta_correcta, explicacion: null,
      fuente_normativa: q.fuente,
      tema: q.tema ?? (TEMAS.length ? TEMAS[cuantas % TEMAS.length] : null),
      subtema: null, dificultad: null,
      destacada_home: false, confianza: q.confianza, revisada: cuantas < REVISADAS,
      nota_revision: null, revisada_por: null, revisada_en: null,
      organismo: q.organismo, instancia: examen.instancia, modalidad: examen.modalidad,
      // PostgREST devuelve los embebidos anidados; la pantalla de revisión
      // filtra por exams.concursos.organismo.
      exams: { concursos: { organismo: q.organismo } },
    });
  }
}

{
  const examen = examenDe('mpd', 'practico', 'tipeo');
  const textos = JSON.parse(readFileSync(resolve(RAIZ, 'material/tipeo/textos.json'), 'utf8'));
  textos.forEach((t, i) => {
    tablas.questions.push({
      id: randomUUID(), exam_id: examen.id, orden: i + 1,
      enunciado: t.texto, tipo: 'tipeo', opciones: [],
      respuesta_correcta: t.texto, explicacion: null,
      fuente_normativa: `texto de práctica: ${t.titulo}`, tema: 'Tipeo', subtema: null,
      dificultad: null, destacada_home: false, confianza: 'media', revisada: true,
      nota_revision: null, revisada_por: null, revisada_en: null,
      organismo: 'mpd', instancia: 'practico', modalidad: 'tipeo',
      exams: { concursos: { organismo: 'mpd' } },
    });
  });
}

/**
 * Los valores por defecto que en la base pone el `default` de cada columna.
 *
 * Sin esto un intento recién creado sale sin `estado`, y la app —que confía en
 * que la base lo dejó en 'en_curso'— lo manda a resultados apenas nace.
 */
const DEFECTOS = {
  attempts: () => ({ estado: 'en_curso', iniciado_en: new Date().toISOString(), finalizado_en: null, puntaje: null }),
  attempt_answers: () => ({ respuesta: null, marcada: false, correcta: null, tiempo_segundos: null, orden: 0, actualizado_en: new Date().toISOString() }),
};

/** La vista: sólo lo publicado y revisado, y sin la respuesta. */
function questionsPublic() {
  return tablas.questions
    .filter((q) => q.revisada)
    .map(({ respuesta_correcta, explicacion, revisada, ...resto }) => resto);
}

function leer(nombre) {
  return nombre === 'questions_public' ? questionsPublic() : (tablas[nombre] ?? null);
}

// ============================================================
// Un PostgREST mínimo
// ============================================================
const RESERVADOS = new Set(['select', 'order', 'limit', 'offset', 'on_conflict', 'columns']);

const enCamino = (fila, camino) => camino.split('.').reduce((v, k) => (v == null ? v : v[k]), fila);

function filtrar(filas, params) {
  let salida = filas;
  for (const [clave, valor] of params) {
    if (RESERVADOS.has(clave)) continue;
    const corte = valor.indexOf('.');
    const op = valor.slice(0, corte);
    const arg = valor.slice(corte + 1);
    if (op === 'eq') {
      salida = salida.filter((f) => String(enCamino(f, clave)) === arg);
    } else if (op === 'in') {
      const lista = new Set(arg.replace(/^\(|\)$/g, '').split(',').map((x) => x.replace(/^"|"$/g, '')));
      salida = salida.filter((f) => lista.has(String(enCamino(f, clave))));
    } else if (op === 'not') {
      const [op2, ...resto] = arg.split('.');
      const arg2 = resto.join('.');
      if (op2 === 'in') {
        const lista = new Set(arg2.replace(/^\(|\)$/g, '').split(',').map((x) => x.replace(/^"|"$/g, '')));
        salida = salida.filter((f) => !lista.has(String(enCamino(f, clave))));
      }
    } else if (op === 'is') {
      salida = salida.filter((f) => (arg === 'null' ? enCamino(f, clave) == null : true));
    }
  }
  const orden = params.get('order');
  if (orden) {
    const [columna, dir] = orden.split('.');
    const signo = dir === 'desc' ? -1 : 1;
    salida = [...salida].sort((a, b) => (a[columna] > b[columna] ? signo : a[columna] < b[columna] ? -signo : 0));
  }
  const limite = params.get('limit');
  return limite ? salida.slice(0, Number(limite)) : salida;
}

function json(res, code, cuerpo, extra = {}) {
  res.writeHead(code, { 'content-type': 'application/json', 'access-control-allow-origin': '*', ...extra });
  res.end(JSON.stringify(cuerpo));
}

/** Devuelve una fila sola o la lista, según el Accept que mandó supabase-js. */
function responder(res, req, filas) {
  const uno = (req.headers.accept || '').includes('pgrst.object');
  if (!uno) return json(res, 200, filas, { 'content-range': `*/${filas.length}` });
  if (filas.length === 1) return json(res, 200, filas[0]);
  return json(res, 406, { code: 'PGRST116', message: `${filas.length} rows` });
}

function sesionDe(u) {
  const access_token = randomUUID();
  porToken.set(access_token, u.id);
  return {
    access_token, refresh_token: randomUUID(), token_type: 'bearer',
    expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600, user: publico(u),
  };
}

const publico = (u) => ({
  id: u.id, aud: 'authenticated', role: 'authenticated', email: u.email,
  email_confirmed_at: new Date().toISOString(), phone: '',
  confirmed_at: new Date().toISOString(), last_sign_in_at: new Date().toISOString(),
  app_metadata: { provider: 'email', providers: ['email'] }, user_metadata: {},
  identities: [{ id: u.id, user_id: u.id, provider: 'email' }],
  created_at: new Date().toISOString(), updated_at: new Date().toISOString(), is_anonymous: false,
});

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  const cuerpo = await new Promise((r) => {
    let d = ''; req.on('data', (c) => (d += c)); req.on('end', () => { try { r(d ? JSON.parse(d) : {}); } catch { r({}); } });
  });
  log.push(`${req.method} ${url.pathname}${url.search}`);

  if (req.method === 'OPTIONS') { res.writeHead(204, { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*' }); return res.end(); }

  // ---------- auth ----------
  if (url.pathname === '/auth/v1/signup') {
    if (usuarios.has(cuerpo.email)) return json(res, 422, { code: 'user_already_exists', msg: 'User already registered' });
    const u = { id: randomUUID(), email: cuerpo.email, clave: cuerpo.password };
    usuarios.set(u.email, u);
    // Sin confirmación por correo: el alta ya trae sesión. Es la diferencia a
    // propósito con el proyecto real, y es lo que permite seguir el recorrido.
    return json(res, 200, sesionDe(u));
  }
  if (url.pathname === '/auth/v1/token') {
    if (url.searchParams.get('grant_type') === 'password') {
      const u = usuarios.get(cuerpo.email);
      if (!u || u.clave !== cuerpo.password) return json(res, 400, { error: 'invalid_grant', error_description: 'Invalid login credentials' });
      return json(res, 200, sesionDe(u));
    }
    const u = [...usuarios.values()][0];
    return u ? json(res, 200, sesionDe(u)) : json(res, 400, { error: 'invalid_grant' });
  }
  if (url.pathname === '/auth/v1/user') {
    const id = usuarioDe(req);
    const u = [...usuarios.values()].find((x) => x.id === id);
    return u ? json(res, 200, publico(u)) : json(res, 401, { code: 401, msg: 'invalid claim' });
  }
  if (url.pathname === '/auth/v1/logout') { res.writeHead(204); return res.end(); }
  if (url.pathname === '/auth/v1/recover' || url.pathname === '/auth/v1/otp') return json(res, 200, {});

  // ---------- perfiles: van aparte porque la clave es el usuario en sesión ----------
  if (url.pathname === '/rest/v1/profiles') {
    const id = usuarioDe(req);
    if (req.method === 'POST') {
      for (const f of Array.isArray(cuerpo) ? cuerpo : [cuerpo]) {
        perfiles.set(f.user_id, { ...(perfiles.get(f.user_id) ?? {}), ...f });
      }
      return json(res, 201, []);
    }
    if (req.method === 'PATCH') {
      perfiles.set(id, { ...(perfiles.get(id) ?? {}), ...cuerpo });
      return json(res, 200, []);
    }
    const guardado = perfiles.get(id) ?? null;
    const fila = guardado ? { rol: ROL, ...guardado } : null;
    if ((req.headers.accept || '').includes('pgrst.object')) {
      return fila ? json(res, 200, fila) : json(res, 406, { code: 'PGRST116', message: 'no rows' });
    }
    return json(res, 200, fila ? [fila] : []);
  }

  // ---------- el resto de las tablas ----------
  if (url.pathname.startsWith('/rest/v1/')) {
    const nombre = url.pathname.slice('/rest/v1/'.length);
    const tabla = leer(nombre);
    if (tabla === null) return json(res, 200, [], { 'content-range': '*/0' });

    if (req.method === 'GET' || req.method === 'HEAD') {
      const filas = filtrar(tabla, url.searchParams);
      if (req.method === 'HEAD') {
        res.writeHead(200, { 'content-range': `*/${filas.length}`, 'access-control-allow-origin': '*' });
        return res.end();
      }
      return responder(res, req, filas);
    }

    if (req.method === 'POST') {
      const defecto = DEFECTOS[nombre] ?? (() => ({}));
      const nuevas = (Array.isArray(cuerpo) ? cuerpo : [cuerpo]).map((f) => ({ id: randomUUID(), ...defecto(), ...f }));
      const conflicto = url.searchParams.get('on_conflict')?.split(',') ?? [];
      for (const fila of nuevas) {
        const previa = conflicto.length
          ? tabla.find((f) => conflicto.every((c) => f[c] === fila[c]))
          : undefined;
        if (previa) Object.assign(previa, fila);
        else tabla.push(fila);
      }
      return responder(res, req, nuevas);
    }

    if (req.method === 'PATCH') {
      const filas = filtrar(tabla, url.searchParams);
      for (const f of filas) Object.assign(f, cuerpo);
      return responder(res, req, filas);
    }

    if (req.method === 'DELETE') {
      for (const f of filtrar(tabla, url.searchParams)) tabla.splice(tabla.indexOf(f), 1);
      return json(res, 204, []);
    }
  }

  if (url.pathname === '/__log') return json(res, 200, log);
  json(res, 404, { mensaje: 'sin ruta', ruta: url.pathname });
}).listen(54321, () => {
  const revisadas = tablas.questions.filter((q) => q.revisada).length;
  console.log(`supabase falso en http://127.0.0.1:54321`);
  console.log(`  ${tablas.questions.length} preguntas cargadas, ${revisadas} revisadas (BANCO_REVISADAS=${REVISADAS})`);
});
