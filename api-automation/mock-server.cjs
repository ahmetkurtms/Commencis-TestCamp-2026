// local mock: /api/users and /api/users/:id
const http = require('http');
const { URL } = require('url');

let nextId = 100;
const users = new Map([
  [1, { id: 1, firstName: 'Leanne', lastName: 'Graham', email: 'leanne@test.dev' }],
  [2, { id: 2, firstName: 'Ervin', lastName: 'Howell', email: 'ervin@test.dev' }],
]);
nextId = 3;

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

const server = http.createServer(async (req, res) => {
  const u = new URL(req.url || '/', 'http://127.0.0.1');
  const pathname = u.pathname.replace(/\/$/, '') || '/';

  res.setHeader('Content-Type', 'application/json');

  const isList = pathname === '/api/users';
  const oneMatch = pathname.match(/^\/api\/users\/(\d+)$/);
  const id = oneMatch ? parseInt(oneMatch[1], 10) : null;

  try {
    if (req.method === 'GET' && isList) {
      const data = Array.from(users.values());
      res.writeHead(200);
      res.end(JSON.stringify({ page: 1, per_page: data.length, total: data.length, data }));
      return;
    }

    if (req.method === 'POST' && isList) {
      const body = await parseBody(req);
      const nid = nextId++;
      const user = {
        id: nid,
        firstName: body.firstName ?? body.firstname ?? body.first_name ?? '',
        lastName: body.lastName ?? body.lastname ?? body.last_name ?? '',
        email: body.email ?? `user${nid}@test.dev`,
      };
      users.set(nid, user);
      res.writeHead(201);
      res.end(JSON.stringify(user));
      return;
    }

    if (req.method === 'GET' && id != null) {
      const user = users.get(id);
      if (!user) {
        res.writeHead(404);
        res.end(JSON.stringify({}));
        return;
      }
      res.writeHead(200);
      res.end(JSON.stringify({ data: user }));
      return;
    }

    if (req.method === 'PUT' && id != null) {
      const body = await parseBody(req);
      const user = users.get(id);
      if (!user) {
        res.writeHead(404);
        res.end(JSON.stringify({}));
        return;
      }
      const pickFirst =
        body.firstName ?? body.firstname ?? body.first_name;
      const pickLast = body.lastName ?? body.lastname ?? body.last_name;
      if (pickFirst !== undefined) user.firstName = pickFirst;
      if (pickLast !== undefined) user.lastName = pickLast;
      if (body.email !== undefined) user.email = body.email;
      res.writeHead(200);
      res.end(JSON.stringify(user));
      return;
    }

    if (req.method === 'DELETE' && id != null) {
      if (!users.has(id)) {
        res.writeHead(404);
        res.end(JSON.stringify({}));
        return;
      }
      users.delete(id);
      res.writeHead(204);
      res.end();
      return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: 'not found' }));
  } catch (e) {
    res.writeHead(500);
    res.end(JSON.stringify({ error: String(e && e.message) }));
  }
});

server.listen(9999, '127.0.0.1', () => {
  process.stdout.write('mock user API listening on http://127.0.0.1:9999\n');
});
