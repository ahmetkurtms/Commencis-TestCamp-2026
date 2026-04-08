# TC-BLOGS-POPULAR — Commencis Thoughts / Popular

## Ön koşullar

- Playwright’ta normal Chrome User-Agent (`playwright.config.ts`).
- Çerez bandı çıkarsa kabul edilir.

## Adımlar

1. `https://www.commencis.com/` aç.
2. Üst menü **Insights** → **Blog** (mega menü).
3. URL’nin thoughts indeksi olduğunu doğrula (`/thoughts/`).
4. Listede **Popular** sekmesinin aktif olduğunu doğrula.
5. Popular ızgarasından benzersiz makale URL’lerini topla (`/thoughts/{slug}/`).
6. Her URL için (`COMMENCIS_POPULAR_LIMIT` ile sınırlandırılabilir):
   - Görünür **başlık** (`article` / `#blog-title` `h1`).
   - **İçerik** (ana sütunda yeterli metin).
   - **Tarih** (yan sütun `.date-info` veya `.news-info`).
   - **Stay Tuned** e-posta alanı ve gönder düğmesi.
   - **Yazar** (yan sütun `h3` veya meta author).
   - Yazar **Commencis** ise yazar görseli:  
     `https://www.commencis.com/wp-content/uploads/2018/03/commencis-favicon.png`

## Otomasyon

`tests/blogs-popular.spec.ts`
