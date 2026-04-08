import { expect, test, type Page } from '@playwright/test';
import {
  acceptCookiesIfPresent,
  COMMENCIS_FAVICON_AUTHOR_IMG,
  openBlogViaInsightsMenu,
  subscribeColumn,
} from './helpers/commencis';

async function resolvedImgSrc(img: ReturnType<Page['locator']>): Promise<string> {
  return (await img.evaluate((el: HTMLImageElement) => el.currentSrc || el.src)) ?? '';
}

test.describe('commencis thoughts popular', () => {
  test('insights blog + popular cards', async ({ page }) => {
    test.setTimeout(360_000);
    await page.goto('/');
    await acceptCookiesIfPresent(page);
    await openBlogViaInsightsMenu(page);

    await expect(page).toHaveURL(/commencis\.com\/thoughts\/?$/);
    await expect(page.getByRole('heading', { name: /Commencis Thoughts/i })).toBeVisible();

    await expect(page.locator('.vc_tta-tab.active').first()).toContainText('Popular');
    const popularPane = page.locator('.uncode-tabs .tab-content .tab-pane.active');
    await expect(popularPane).toBeVisible();

    const cards = popularPane.locator('.isotope-container .tmb');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    const urls: string[] = [];
    const seen = new Set<string>();
    for (let i = 0; i < count; i++) {
      const link = cards.nth(i).locator('a[href*="/thoughts/"]').first();
      const href = await link.getAttribute('href');
      if (!href) continue;
      const abs = new URL(href, page.url()).href;
      if (!/\/thoughts\/[^/]+\/$/.test(abs)) continue;
      if (seen.has(abs)) continue;
      seen.add(abs);
      urls.push(abs);
    }

    expect(urls.length).toBeGreaterThan(0);

    const limitRaw = process.env.COMMENCIS_POPULAR_LIMIT;
    const toVisit = limitRaw ? urls.slice(0, Number(limitRaw)) : urls;

    for (const articleUrl of toVisit) {
      await test.step(articleUrl, async () => {
        await page.goto(articleUrl);
        await acceptCookiesIfPresent(page);

        const title = page.locator('article.post h1, #blog-title h1').first();
        await expect(title).toBeVisible();
        await expect(title).not.toHaveText('');

        const main = page.locator('#main-article-section, article .post-content').first();
        await expect(main).toBeVisible();
        const bodyText = (await main.innerText()).replace(/\s+/g, ' ').trim();
        expect(bodyText.length).toBeGreaterThan(80);

        const side = subscribeColumn(page);
        await expect(side).toBeVisible();

        const dateInfo = side.locator('.date-info');
        const hasStructuredDate = await dateInfo.isVisible().catch(() => false);
        if (hasStructuredDate) {
          await expect(dateInfo).toHaveText(/\d{1,2}\/\d{1,2}\/\d{4}/);
        } else {
          const newsInfo = page.locator('.news-info').first();
          await expect(newsInfo).toBeVisible();
          await expect(newsInfo).toContainText(/\d{4}/);
        }

        const email = side.locator('input[type="email"]').first();
        await expect(email).toBeVisible();
        await expect(email).toBeEditable();

        const stayTuned = side.locator('input[type="submit"][value="Stay Tuned"]');
        await expect(stayTuned).toBeVisible();

        const authorHeading = side.locator('.icon-box-content h3').first();
        const hasAuthorBox = await authorHeading.isVisible().catch(() => false);
        let authorName: string;
        if (hasAuthorBox) {
          authorName = (await authorHeading.innerText()).trim();
          expect(authorName.length).toBeGreaterThan(0);
        } else {
          const metaAuthor = page.locator('meta[name="author"]').first();
          await expect(metaAuthor).toHaveAttribute('content', /.+/);
          authorName = (await metaAuthor.getAttribute('content'))!.trim();
        }

        if (authorName === 'Commencis') {
          const avatar = side.locator('.icon-box.icon-box-left img, .icon-box-icon img').first();
          await expect(avatar).toBeVisible();
          const src = await resolvedImgSrc(avatar);
          expect(src).toBe(COMMENCIS_FAVICON_AUTHOR_IMG);
        }
      });
    }
  });
});
