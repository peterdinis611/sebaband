import { defineConfig, devices } from '@playwright/test';

const port = 4173;
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
	testDir: 'e2e',
	testIgnore: ['**/stress/**'],
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: [['list'], ['html', { open: 'never' }]],
	timeout: 30_000,
	expect: { timeout: 8_000 },
	use: {
		baseURL,
		trace: 'on-first-retry',
		screenshot: 'only-on-failure',
		// Skip boot curtain / motion that hides content
		reducedMotion: 'reduce',
		locale: 'sk-SK'
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] }
		},
		{
			name: 'mobile',
			use: {
				...devices['Pixel 7'],
				browserName: 'chromium'
			}
		}
	],
	webServer: {
		command: `npm run build && npm run preview -- --host 127.0.0.1 --port ${port}`,
		url: baseURL,
		reuseExistingServer: !process.env.CI,
		timeout: 180_000
	}
});
