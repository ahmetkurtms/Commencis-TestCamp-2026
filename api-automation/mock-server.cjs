// Local mock for Thinking Tester Contact List API shape (USE_LOCAL_MOCK=1).
const http = require('http');
const crypto = require('crypto');
const { URL } = require('url');

/** @type {Map<string, { _id: string, firstName: string, lastName: string, email: string, password: string }>} */
const sessions = new Map();

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let buf = '';
    req.on('data', (c) => {
      buf += c;
    });
    req.on('end', () => {
      if (!buf) return resolve({});
      try {
        resolve(JSON.parse(buf));
      } catch (e) {
        reject(e);
      }
    });
  });
}

function bearerToken(req) {
  const h = req.headers.authorization || '';
  const m = /^Bearer\s+(.+)$/i.exec(h);
  return m ? m[1].trim() : null;
}

const server = http.createServer(async (req, res) => {
  const u = new URL(req.url || '/', 'http://127.0.0.1');
  const pathname = u.pathname.replace(/\/$/, '') || '/';

  res.setHeader('Content-Type', 'application/json');

  try {
    if (req.method === 'GET' && pathname === '/') {
      res.writeHead(200);
      res.end(JSON.stringify({ ok: true }));
      return;
    }

    if (req.method === 'POST' && pathname === '/users') {
      const body = await parseBody(req);
      const _id = crypto.randomBytes(12).toString('hex');
      const token = crypto.randomBytes(24).toString('hex');
      const user = {
        _id,
        firstName: body.firstName ?? '',
        lastName: body.lastName ?? '',
        email: body.email ?? '',
      };
      sessions.set(token, {
        ...user,
        password: body.password ?? '',
      });
      res.writeHead(201);
      res.end(JSON.stringify({ user, token }));
      return;
    }

    const token = bearerToken(req);
    const session = token ? sessions.get(token) : null;

    if (req.method === 'GET' && pathname === '/contacts') {
      if (!session) {
        res.writeHead(401);
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
      }
      res.writeHead(200);
      res.end(JSON.stringify([]));
      return;
    }

    if (pathname === '/users/me') {
      if (!session) {
        res.writeHead(401);
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
      }

      if (req.method === 'GET') {
        const { password: _p, ...pub } = session;
        res.writeHead(200);
        res.end(JSON.stringify(pub));
        return;
      }

      if (req.method === 'PATCH') {
        const body = await parseBody(req);
        if (body.firstName !== undefined) session.firstName = body.firstName;
        if (body.lastName !== undefined) session.lastName = body.lastName;
        if (body.email !== undefined) session.email = body.email;
        if (body.password !== undefined) session.password = body.password;
        const { password: _p, ...pub } = session;
        res.writeHead(200);
        res.end(JSON.stringify(pub));
        return;
      }

      if (req.method === 'DELETE') {
        sessions.delete(token);
        res.writeHead(200);
        res.end(JSON.stringify({ message: 'User deleted' }));
        return;
      }
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: 'not found' }));
  } catch (e) {
    res.writeHead(500);
    res.end(JSON.stringify({ error: String(e && e.message) }));
  }
});

server.listen(9999, '127.0.0.1', () => {
  process.stdout.write('mock Contact List API on http://127.0.0.1:9999\n');
});
