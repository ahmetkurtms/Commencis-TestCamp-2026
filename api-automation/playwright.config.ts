import { defineConfig } from '@playwright/test';

const useMock = !process.env.API_BASE_URL;

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
    baseURL: process.env.API_BASE_URL ?? 'http://127.0.0.1:9999/api/',
    extraHTTPHeaders: { Accept: 'application/json' },
  },
  ...(useMock
    ? {
        webServer: {
          command: 'node ./mock-server.cjs',
          url: 'http://127.0.0.1:9999/api/users',
          reuseExistingServer: !process.env.CI,
          timeout: 20_000,
        },
      }
    : {}),
  outputDir: 'test-results/artifacts',
});
