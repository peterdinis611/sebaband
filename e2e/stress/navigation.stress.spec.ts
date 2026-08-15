import { expect, test } from '../fixtures';

const routes = [
	'/',
	'/o-nas',
	'/galeria',
	'/videa',
	'/rezervacie',
	'/kontakt',
	'/rezervacne-podmienky'
] as const;

test.describe('Stress — navigácia', () => {
	test('rýchle prechádzanie všetkých stránok v cykle', async ({ page }) => {
		const rounds = 8;
		for (let round = 0; round < rounds; round++) {
			for (const path of routes) {
				const res = await page.goto(path, { waitUntil: 'domcontentloaded' });
				expect(res?.ok(), `${path} round ${round}`).toBeTruthy();
				await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
			}
		}
	});

	test('spät / dopredu históriou bez pádu', async ({ page }) => {
		for (const path of routes) {
			await page.goto(path, { waitUntil: 'domcontentloaded' });
		}
		for (let i = 0; i < routes.length - 1; i++) {
			await page.goBack({ waitUntil: 'domcontentloaded' });
			await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
		}
		for (let i = 0; i < routes.length - 1; i++) {
			await page.goForward({ waitUntil: 'domcontentloaded' });
			await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
		}
	});
});
