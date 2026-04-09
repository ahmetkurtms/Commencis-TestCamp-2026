# api-automation

**Varsayılan:** `baseURL` = `https://thinking-tester-contact-list.herokuapp.com` — testler ağa çıkar.

**Yerel mock:** `USE_LOCAL_MOCK=1` veya `npm run test:local`. Playwright `webServer` ile `mock-server.cjs` (127.0.0.1:9999) kalkar; `GET /` → `{ ok: true }` sağlık kontrolü.

**Özel host:** `API_BASE_URL` (Thinking Tester ile aynı path yapısı; `/api` öneki yok).

Akış: `POST /users` → `GET /contacts` (header: `Authorization: Bearer <token>`) → `GET/PATCH/DELETE /users/me`. Profil güncellemede **PATCH** (PUT değil); e-posta değişince benzersiz adres kullan.

Postman: https://documenter.getpostman.com/view/4012288/TzK2bEa8
