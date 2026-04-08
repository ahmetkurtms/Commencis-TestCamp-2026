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

1. Kullanıcı listesini al  
2. Kullanıcı ekle  
3. GET ile eklenen bilgileri doğrula  
4. `firstName` / `lastName` için rastgele stringlerle güncelle  
5. GET ile son hali doğrula  
6. Sil  
7. GET ile kullanıcının silindiğini doğrula (ör. 404)

**Araç:** Playwright `request` + TypeScript. Yerel **mock** (`mock-server.cjs`) testle birlikte açılır. Harici URL: `API_BASE_URL` (ayrıntı `api-automation/NOTLAR.md`).

## Nasıl çalıştırılır?

```bash
# GUI testleri
cd gui-automation
npm install
npx playwright install chromium
npm test
```

```bash
# API testleri
cd api-automation
npm install
npx playwright install
npm test
```

Raporları açmak:

```bash
cd gui-automation && npm run report
cd api-automation && npm run report
```