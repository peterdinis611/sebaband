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
	const buf = fs.readFileSync(input);
	const meta = await sharp(buf).metadata();
	const w = meta.width ?? 0;

	const pipeline = (width) =>
		sharp(buf).resize(Math.min(width, w) || null, null, { withoutEnlargement: true });

	await pipeline(720)
		.webp({ quality: 76, effort: 4 })
		.toFile(path.join(dir, `${base}-sm.webp`));
	await pipeline(1100)
		.webp({ quality: 80, effort: 4 })
		.toFile(path.join(dir, `${base}-md.webp`));
	await sharp(buf)
		.webp({ quality: 82, effort: 4 })
		.toFile(path.join(dir, `${base}.webp`));

	await pipeline(720)
		.avif({ quality: 55, effort: 4 })
		.toFile(path.join(dir, `${base}-sm.avif`));
	await pipeline(1100)
		.avif({ quality: 58, effort: 4 })
		.toFile(path.join(dir, `${base}-md.avif`));
	await sharp(buf)
		.avif({ quality: 60, effort: 4 })
		.toFile(path.join(dir, `${base}.avif`));

	// Lean JPEG kept for OG/social crawlers that still prefer it
	if (/\.jpe?g$/i.test(file)) {
		const tmp = path.join(dir, `${base}.tmp.jpg`);
		await sharp(buf)
			.resize(Math.min(1200, w), null, { withoutEnlargement: true })
			.jpeg({ quality: 72, mozjpeg: true })
			.toFile(tmp);
		fs.renameSync(tmp, input);
	}

	console.log(`✓ ${file}`);
}

console.log('Image variants ready (sm / md / full · webp + avif).');
