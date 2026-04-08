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
  const insights = page.locator('#gm-main-menu a.gm-dropdown-toggle').filter({ hasText: /^Insights$/ });
  await insights.first().waitFor({ state: 'visible', timeout: 15_000 });
  const blogEntry = page
    .locator('div.tablet-hidden.mobile-hidden#menu-services a[title="Blog"]')
    .first();

  const blogUrl = /commencis\.com\/thoughts\/?(\?.*)?$/;
  for (let attempt = 0; attempt < 3; attempt++) {
    await insights.first().hover();
    await blogEntry.click({ force: true });
    try {
      await page.waitForURL(blogUrl, { timeout: 15_000 });
      return;
    } catch {}
  }
  throw new Error('could not open blog from insights menu');
}

export function subscribeColumn(page: Page) {
  return page
    .locator('#c-subscribe, .wpb_column.box-subscribe, .wpb_column.c-subscribe')
    .first();
}
