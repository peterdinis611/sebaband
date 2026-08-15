import { expect, site, test } from './fixtures';

test.describe('Kontakt', () => {
	test('má telefón, e-mail a sociálne siete', async ({ page }) => {
		await page.goto('/kontakt');
		await expect(page.getByRole('link', { name: site.phoneDisplay }).first()).toBeVisible();
		await expect(page.getByRole('link', { name: site.email }).first()).toBeVisible();
		await expect(page.getByRole('link', { name: /Facebook/i }).first()).toBeVisible();
		await expect(page.getByRole('link', { name: /TikTok/i }).first()).toBeVisible();
		await expect(page.getByRole('link', { name: /YouTube/i }).first()).toBeVisible();
	});

	test('nemá formulár dopytu — ten je v rezerváciách', async ({ page }) => {
		await page.goto('/kontakt');
		await expect(page.locator('#dopyt')).toHaveCount(0);
		await expect(page.getByRole('link', { name: /Rezervácia|dopyt/i }).first()).toHaveAttribute(
			'href',
			/\/rezervacie#dopyt/
		);
	});
});
