# Commencis Test Camp — Ödev

## Ödev özeti

### 1) GUI otomasyonu (`gui-automation/`)

- Commencis sitesinde üst menüden **Insights → Blog** ile blog listesine gidilir.
- Sayfanın açıldığı doğrulanır.
- **Popular** bölümündeki her yazı için (makale sayfasında): başlık, içerik, tarih, “Stay Tuned” e-posta alanı ve butonu, yazar kontrol edilir.
- Yazar adı **Commencis** ise yazar görselinin adresi şu olmalıdır:  
  `https://www.commencis.com/wp-content/uploads/2018/03/commencis-favicon.png`

**Araç:** Playwright + TypeScript. Özet senaryolar: `commencis/test-cases/`, ek notlar: `NOTLAR.md`.

### 2) API otomasyonu (`api-automation/`)

Postman dokümantasyonu: [Contact List](https://documenter.getpostman.com/view/4012288/TzK2bEa8)

Akış:

1. `POST /users` ile kayıt (benzersiz e-posta); yanıtta `token` ve `user`.  
2. `GET /contacts` (Bearer) — boş dizi veya liste.  
3. `GET /users/me` ile profil doğrula.  
4. `PATCH /users/me` ile rastgele `firstName` / `lastName` ve yeni e-posta (şifre aynı).  
5. `GET /users/me` ile güncellemeyi doğrula.  
6. `DELETE /users/me`.  
7. `GET /users/me` → **401** (token artık geçersiz).

**Araç:** Playwright `request` + TypeScript. **Varsayılan hedef:** `https://thinking-tester-contact-list.herokuapp.com` (internet gerekir). İnternetsiz / izole çalıştırmak için `USE_LOCAL_MOCK=1` veya `npm run test:local` — Playwright `mock-server.cjs`’i açar. Başka host için `API_BASE_URL` (Thinking Tester’da yol öneki yok; sonda `/` kullanma). Ayrıntı: `api-automation/NOTLAR.md`.

## Nasıl çalıştırılır?

```bash
# GUI testleri
cd gui-automation
npm install
npx playwright install chromium
npm test
```

```bash
# API testleri (canlı Heroku API)
cd api-automation
npm install
npx playwright install
npm test

# Yerel mock (USE_LOCAL_MOCK=1)
npm run test:local
```

Raporları açmak:

```bash
cd gui-automation && npm run report
cd api-automation && npm run report
```