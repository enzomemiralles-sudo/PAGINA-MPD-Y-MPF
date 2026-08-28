/**
 * Un Supabase de juguete, sólo para recorrer el flujo de punta a punta.
 *
 * El proyecto real tiene la confirmación por correo prendida, así que un alta
 * nueva nunca devuelve sesión y no hay forma de ver las pantallas de adentro.
 * Esto implementa lo mínimo que usa @supabase/ssr —alta, ingreso, /user,
 * refresh, logout— más los cuatro endpoints de PostgREST que toca la app.
 * Todo en memoria: se apaga y no queda nada.
 */
import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';

const usuarios = new Map();   // email -> { id, email, clave }
const porToken = new Map();   // access_token -> user_id
const perfiles = new Map();   // user_id -> fila

const log = [];
const usuarioDe = (req) => porToken.get((req.headers.authorization || '').replace(/^Bearer /, ''));

function json(res, code, cuerpo, extra = {}) {
  const s = JSON.stringify(cuerpo);
  res.writeHead(code, { 'content-type': 'application/json', 'access-control-allow-origin': '*', ...extra });
  res.end(s);
}

function sesionDe(u) {
  const access_token = randomUUID();
  porToken.set(access_token, u.id);
  return {
    access_token,
    refresh_token: randomUUID(),
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    user: publico(u),
  };
}

const publico = (u) => ({
  id: u.id, aud: 'authenticated', role: 'authenticated', email: u.email,
  email_confirmed_at: new Date().toISOString(), phone: '',
  confirmed_at: new Date().toISOString(), last_sign_in_at: new Date().toISOString(),
  app_metadata: { provider: 'email', providers: ['email'] }, user_metadata: {},
  identities: [{ id: u.id, user_id: u.id, provider: 'email' }], created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  is_anonymous: false,
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

  // ---------- PostgREST ----------
  if (url.pathname === '/rest/v1/profiles') {
    const id = usuarioDe(req);
    if (req.method === 'POST') {
      const filas = Array.isArray(cuerpo) ? cuerpo : [cuerpo];
      for (const f of filas) perfiles.set(f.user_id, { ...(perfiles.get(f.user_id) ?? {}), ...f });
      return json(res, 201, []);
    }
    if (req.method === 'PATCH') {
      perfiles.set(id, { ...(perfiles.get(id) ?? {}), ...cuerpo });
      return json(res, 200, []);
    }
    const fila = perfiles.get(id) ?? null;
    const pide1 = (req.headers.accept || '').includes('pgrst.object');
    if (pide1) return fila ? json(res, 200, fila) : json(res, 406, { code: 'PGRST116', message: 'no rows' });
    return json(res, 200, fila ? [fila] : []);
  }
  if (url.pathname.startsWith('/rest/v1/')) {
    // El resto de las tablas van vacías: la app cae a sus datos de prueba.
    if ((req.headers.prefer || '').includes('count=exact') || url.searchParams.has('select'))
      return json(res, 200, [], { 'content-range': '*/0' });
    return json(res, 200, []);
  }

  if (url.pathname === '/__log') return json(res, 200, log);
  json(res, 404, { mensaje: 'sin ruta', ruta: url.pathname });
}).listen(54321, () => console.log('supabase falso en http://127.0.0.1:54321'));
