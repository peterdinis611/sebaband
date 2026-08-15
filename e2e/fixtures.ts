import { test as base, expect } from '@playwright/test';
import { site } from '../src/lib/data/site';

export const test = base.extend({
	page: async ({ page }, use) => {
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await use(page);
	}
});

export { expect, site };
