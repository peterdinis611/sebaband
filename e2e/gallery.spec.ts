import { expect, test } from './fixtures';

test.describe('Galéria', () => {
	test('otvorí a zatvorí lightbox', async ({ page }) => {
		await page.goto('/galeria');

		const thumb = page.locator('.js-gallery button').first();
		await expect(thumb).toBeVisible();
		await thumb.click();

		const dialog = page.getByRole('dialog');
		await expect(dialog).toBeVisible();
		await expect(dialog.getByRole('img')).toBeVisible();

		await dialog.getByRole('button', { name: /Zavrieť/i }).click();
		await expect(dialog).toHaveCount(0);
	});

	test('zatvorí lightbox cez Escape', async ({ page }) => {
		await page.goto('/galeria');
		await page.locator('.js-gallery button').first().click();
		await expect(page.getByRole('dialog')).toBeVisible();
		await page.keyboard.press('Escape');
		await expect(page.getByRole('dialog')).toHaveCount(0);
	});
});
