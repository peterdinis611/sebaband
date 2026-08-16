/**
 * HTTP load / stress against the preview (or any BASE_URL).
 *
 * Usage:
 *   npm run preview -- --host 127.0.0.1 --port 4173   # in another terminal, after build
 *   npm run test:load
 *
 * Env:
 *   BASE_URL       default http://127.0.0.1:4173
 *   CONCURRENCY    parallel clients (default 40)
 *   DURATION_MS    how long to run (default 20000)
 *   RAMP_MS        warm-up before counting (default 2000)
 */

const BASE_URL = process.env.BASE_URL ?? 'http://127.0.0.1:4173';
const CONCURRENCY = Number(process.env.CONCURRENCY ?? 40);
const DURATION_MS = Number(process.env.DURATION_MS ?? 20_000);
const RAMP_MS = Number(process.env.RAMP_MS ?? 2_000);

const PATHS = [
	'/',
	'/o-nas',
	'/galeria',
	'/videa',
	'/rezervacie',
	'/kontakt',
	'/rezervacne-podmienky',
	'/images/hero-band.webp',
	'/images/logo.webp'
];

const stats = {
	ok: 0,
	fail: 0,
	bytes: 0,
	latencies: /** @type {number[]} */ ([])
};

let stopAt = 0;
let counting = false;

function pickPath() {
	return PATHS[Math.floor(Math.random() * PATHS.length)];
}

async function hit() {
	while (Date.now() < stopAt) {
		const path = pickPath();
		const url = `${BASE_URL}${path}`;
		const t0 = performance.now();
		try {
			const res = await fetch(url, {
				headers: { 'cache-control': 'no-cache', accept: '*/*' }
			});
			const buf = await res.arrayBuffer();
			const ms = performance.now() - t0;
			if (counting) {
				stats.latencies.push(ms);
				stats.bytes += buf.byteLength;
				if (res.ok) stats.ok += 1;
				else stats.fail += 1;
			}
		} catch {
			if (counting) stats.fail += 1;
		}
	}
}

function percentile(sorted, p) {
	if (!sorted.length) return 0;
	const idx = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
	return sorted[idx];
}

async function waitForServer() {
	const deadline = Date.now() + 60_000;
	while (Date.now() < deadline) {
		try {
			const res = await fetch(BASE_URL);
			if (res.ok || res.status < 500) return;
		} catch {
			/* retry */
		}
		await new Promise((r) => setTimeout(r, 400));
	}
	throw new Error(`Server not reachable at ${BASE_URL}`);
}

async function main() {
	console.log(`Load stress → ${BASE_URL}`);
	console.log(`concurrency=${CONCURRENCY} duration=${DURATION_MS}ms ramp=${RAMP_MS}ms`);
	await waitForServer();

	stopAt = Date.now() + RAMP_MS + DURATION_MS;
	const workers = Array.from({ length: CONCURRENCY }, () => hit());

	await new Promise((r) => setTimeout(r, RAMP_MS));
	counting = true;
	const measureStart = Date.now();
	await Promise.all(workers);
	const elapsedSec = Math.max(0.001, (Date.now() - measureStart) / 1000);

	const sorted = [...stats.latencies].sort((a, b) => a - b);
	const total = stats.ok + stats.fail;
	const rps = total / elapsedSec;
	const errRate = total ? (stats.fail / total) * 100 : 100;

	console.log('\n── Results ──');
	console.log(`requests:   ${total} (ok ${stats.ok} / fail ${stats.fail})`);
	console.log(`throughput: ${rps.toFixed(1)} req/s`);
	console.log(`transfer:   ${(stats.bytes / 1024 / 1024).toFixed(2)} MiB`);
	console.log(
		`latency:    p50=${percentile(sorted, 50).toFixed(0)}ms  p95=${percentile(sorted, 95).toFixed(0)}ms  p99=${percentile(sorted, 99).toFixed(0)}ms`
	);
	console.log(`error rate: ${errRate.toFixed(2)}%`);

	// Soft gates for a local static preview
	if (errRate > 5) {
		console.error('\nFAIL: error rate > 5%');
		process.exit(1);
	}
	if (percentile(sorted, 95) > 3000) {
		console.error('\nFAIL: p95 latency > 3000ms');
		process.exit(1);
	}
	console.log('\nPASS');
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
