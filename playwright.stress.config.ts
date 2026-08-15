import { defineConfig, devices } from '@playwright/test';

const port = 4173;
const baseURL = `http://127.0.0.1:${port}`;

/** Aggressive UI stress suite — run via `npm run test:stress`. */
export default defineConfig({
	testDir: 'e2e/stress',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: 0,
	workers: 2,
	reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report-stress' }]],
	timeout: 120_000,
	expect: { timeout: 15_000 },
	use: {
		baseURL,
		trace: 'on-first-retry',
		screenshot: 'only-on-failure',
		reducedMotion: 'reduce',
		locale: 'sk-SK'
	},
	projects: [
		{
			name: 'stress-chromium',
			use: { ...devices['Desktop Chrome'] }
		}
	],
	webServer: {
		command: `npm run build && npm run preview -- --host 127.0.0.1 --port ${port}`,
		url: baseURL,
		reuseExistingServer: !process.env.CI,
		timeout: 180_000
	}
});
