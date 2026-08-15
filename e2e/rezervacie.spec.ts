import { expect, site, test } from './fixtures';

test.describe('Rezervácie', () => {
	test('má kalendár a formulár dopytu', async ({ page }) => {
		await page.goto('/rezervacie');
		await expect(page.locator('#dopyt')).toBeVisible();
		await expect(page.getByRole('heading', { name: /Napíšte nám/i })).toBeVisible();
		await expect(page.getByRole('link', { name: site.phoneDisplay }).first()).toBeVisible();
	});

	test('hash #dopyt scrollne na formulár', async ({ page }) => {
		await page.goto('/rezervacie#dopyt');
		await expect(page.locator('#dopyt')).toBeInViewport();
	});

	test('formulár má povinné polia', async ({ page }) => {
		await page.goto('/rezervacie');
		const form = page.locator('#dopyt');
		await expect(form.locator('input[name="name"]')).toBeVisible();
		await expect(form.locator('input[name="phone"]')).toBeVisible();
		await expect(form.locator('input[name="email"]')).toBeVisible();
		await expect(form.getByRole('button', { name: /Odoslať dopyt/i })).toBeVisible();
	});
});
