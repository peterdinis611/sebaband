#!/usr/bin/env node
/**
 * Verify production (or preview) serves Brotli + cache headers.
 * Usage: node scripts/check-host.mjs [https://sebaband.sk]
 */
const base = (process.argv[2] || 'https://sebaband.sk').replace(/\/$/, '');

async function probe(path, { expectImmutable = false } = {}) {
	const url = `${base}${path}`;
	const res = await fetch(url, {
		headers: { 'Accept-Encoding': 'br, gzip' },
		redirect: 'follow'
	});
	const encoding = res.headers.get('content-encoding') || '(none)';
	const cache = res.headers.get('cache-control') || '(none)';
	const ok = res.ok;
	const br = encoding.includes('br');
	const immutable = /immutable/i.test(cache) || /max-age=31536000/i.test(cache);
	const pass = ok && (!expectImmutable || immutable);
	console.log(
		`${pass ? '✓' : '✗'} ${path}\n  status ${res.status}  encoding=${encoding}  cache=${cache}`
	);
	return { pass, br };
}

const results = [];
results.push(await probe('/'));
results.push(await probe('/fonts.css'));
results.push(await probe('/fonts/big-shoulders-display-latin-900-normal.woff2', { expectImmutable: true }));
results.push(await probe('/images/hero-band-sm.avif', { expectImmutable: true }));

// Pick first hashed JS from homepage HTML if possible
try {
	const html = await (await fetch(base)).text();
	const m = html.match(/\/_app\/immutable\/[^"']+\.js/);
	if (m) results.push(await probe(m[0], { expectImmutable: true }));
} catch {
	/* ignore */
}

const failed = results.filter((r) => !r.pass).length;
const anyBr = results.some((r) => r.br);
if (!anyBr) {
	console.log(
		'\n⚠ No Brotli (br) detected — host may still gzip, or CDN needs Accept-Encoding. adapter-static precompress emits .br files; ensure the host serves them.'
	);
}
process.exit(failed ? 1 : 0);
