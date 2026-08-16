import { expect, site, test } from './fixtures';

test.describe('Domov', () => {
	test('načíta hero a kontaktné CTA', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('heading', { level: 1 })).toContainText(/SEBA/i);
		await expect(page.getByRole('heading', { level: 1 })).toContainText(/BAND/i);
		await expect(page.getByRole('link', { name: /Rezervácia/i }).first()).toBeVisible();
		await expect(page.getByRole('link', { name: /Videá/i }).first()).toBeVisible();
	});

	test('ukáže telefón kapely', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('link', { name: site.phoneDisplay }).first()).toBeVisible();
	});
});
