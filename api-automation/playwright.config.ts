import { defineConfig } from '@playwright/test';

const useLocalMock = process.env.USE_LOCAL_MOCK === '1';
const heroku = 'https://thinking-tester-contact-list.herokuapp.com';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [
    ['html', { outputFolder: 'test-results/playwright-report', open: 'never' }],
    ['list'],
  ],
  use: {
    baseURL: useLocalMock ? 'http://127.0.0.1:9999' : process.env.API_BASE_URL || heroku,
    extraHTTPHeaders: { Accept: 'application/json' },
  },
  ...(useLocalMock
    ? {
        webServer: {
          command: 'node ./mock-server.cjs',
          url: 'http://127.0.0.1:9999/',
          reuseExistingServer: !process.env.CI,
          timeout: 20_000,
        },
      }
    : {}),
  outputDir: 'test-results/artifacts',
});
