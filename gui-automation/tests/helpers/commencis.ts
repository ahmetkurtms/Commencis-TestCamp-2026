import type { Page } from '@playwright/test';

export const COMMENCIS_FAVICON_AUTHOR_IMG =
  'https://www.commencis.com/wp-content/uploads/2018/03/commencis-favicon.png';

export async function acceptCookiesIfPresent(page: Page): Promise<void> {
  const accept = page.getByRole('button', { name: /accept all/i });
  if (await accept.isVisible({ timeout: 2000 }).catch(() => false)) {
    await accept.click();
    await accept.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
  }
}

export async function openBlogViaInsightsMenu(page: Page): Promise<void> {
  await page.locator('body').click({ position: { x: 4, y: 4 }, force: true }).catch(() => {});

  const insights = page
    .locator('#gm-main-menu a.gm-dropdown-toggle')
    .filter({ hasText: /\bInsights\b/i });

  const blogUrl = /commencis\.com\/thoughts\/?(\?.*)?$/;

  for (let attempt = 0; attempt < 4; attempt++) {
    const toggle = insights.first();
    await toggle.waitFor({ state: 'visible', timeout: 20_000 });
    await toggle.scrollIntoViewIfNeeded();
    await toggle.hover({ timeout: 10_000 });

    const mega = page.locator('#menu-services:visible').first();
    const megaOk = await mega
      .waitFor({ state: 'visible', timeout: 10_000 })
      .then(() => true)
      .catch(() => false);
    if (!megaOk) continue;

    const byRole = mega.getByRole('link', { name: /^Blog$/i }).first();
    const byHref = mega
      .locator('a[href*="/thoughts/"]')
      .filter({ hasText: /^Blog$/i })
      .first();

    const blogLink = (await byRole.isVisible().catch(() => false)) ? byRole : byHref;
    await blogLink.click({ timeout: 12_000, force: true });

    try {
      await page.waitForURL(blogUrl, { timeout: 20_000 });
      return;
    } catch {
      /* mega menu sometimes needs another hover / duplicate #menu-services in DOM */
    }
  }
  throw new Error('could not open blog from insights menu');
}

export function subscribeColumn(page: Page) {
  return page
    .locator('#c-subscribe, .wpb_column.box-subscribe, .wpb_column.c-subscribe')
    .first();
}
