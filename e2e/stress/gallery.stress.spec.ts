import { expect, test } from '../fixtures';

test.describe('Stress — galéria', () => {
	test('opakované otváranie a zatváranie lightboxu', async ({ page }) => {
		await page.goto('/galeria');
		const thumbs = page.locator('.js-gallery button');
		const count = await thumbs.count();
		expect(count).toBeGreaterThan(0);

		const cycles = Math.min(count, 6) * 4;
		for (let i = 0; i < cycles; i++) {
			const thumb = thumbs.nth(i % count);
			await thumb.click();
			const dialog = page.getByRole('dialog');
			await expect(dialog).toBeVisible();

			if (i % 2 === 0) {
				await dialog.getByRole('button', { name: /Zavrieť/i }).click();
			} else {
				await page.keyboard.press('Escape');
			}
			await expect(dialog).toHaveCount(0);
		}
	});

	test('šípky v lightboxe pod záťažou', async ({ page }) => {
		await page.goto('/galeria');
		await page.locator('.js-gallery button').first().click();
		const dialog = page.getByRole('dialog');
		await expect(dialog).toBeVisible();

		for (let i = 0; i < 40; i++) {
			await page.keyboard.press(i % 2 === 0 ? 'ArrowRight' : 'ArrowLeft');
			await expect(dialog.getByRole('img')).toBeVisible();
		}

		await page.keyboard.press('Escape');
		await expect(dialog).toHaveCount(0);
	});
});
