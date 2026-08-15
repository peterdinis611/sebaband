import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const dir = path.resolve('static/images');
const files = fs
	.readdirSync(dir)
	.filter((f) => /\.(jpe?g|png)$/i.test(f) && f !== 'logo.png');

for (const file of files) {
	const input = path.join(dir, file);
	const base = file.replace(/\.(jpe?g|png)$/i, '');
	const meta = await sharp(input).metadata();
	const w = meta.width ?? 0;

	await sharp(input)
		.resize(Math.min(720, w), null, { withoutEnlargement: true })
		.webp({ quality: 76, effort: 4 })
		.toFile(path.join(dir, `${base}-sm.webp`));

	await sharp(input)
		.resize(Math.min(1100, w), null, { withoutEnlargement: true })
		.webp({ quality: 80, effort: 4 })
		.toFile(path.join(dir, `${base}-md.webp`));

	await sharp(input)
		.webp({ quality: 82, effort: 4 })
		.toFile(path.join(dir, `${base}.webp`));

	console.log(`✓ ${file}`);
}

console.log('Image variants ready (sm / md / full webp).');
