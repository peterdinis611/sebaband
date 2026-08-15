const HITS_KEY = 'seba-analytics-hits';
const CLICKS_KEY = 'seba-analytics-clicks';
const MAX_CLICKS = 2500;

export type HitRow = {
	path: string;
	count: number;
	last: string;
};

/** Single click sample — percentages keep the heatmap resolution-independent. */
export type ClickSample = {
	path: string;
	/** 0–100 across document width */
	xPct: number;
	/** 0–100 down document height */
	yPct: number;
	/** 0–100 across viewport */
	vxPct: number;
	/** 0–100 down viewport */
	vyPct: number;
	tag: string;
	label: string;
	ts: string;
};

function readJson<T>(key: string, fallback: T): T {
	try {
		const raw = localStorage.getItem(key);
		if (!raw) return fallback;
		return JSON.parse(raw) as T;
	} catch {
		return fallback;
	}
}

function writeJson(key: string, value: unknown) {
	localStorage.setItem(key, JSON.stringify(value));
}

function readHits(): HitRow[] {
	const parsed = readJson<HitRow[]>(HITS_KEY, []);
	return Array.isArray(parsed) ? parsed : [];
}

function writeHits(rows: HitRow[]) {
	writeJson(HITS_KEY, rows);
}

/** Record a client-side page hit (local only). */
export function trackHit(pathname: string) {
	if (typeof localStorage === 'undefined') return;
	if (pathname.startsWith('/analytics')) return;
	if (typeof location !== 'undefined' && new URLSearchParams(location.search).get('preview') === '1')
		return;

	const rows = readHits();
	const now = new Date().toISOString();
	const existing = rows.find((row) => row.path === pathname);
	if (existing) {
		existing.count += 1;
		existing.last = now;
	} else {
		rows.push({ path: pathname, count: 1, last: now });
	}
	rows.sort((a, b) => b.count - a.count || a.path.localeCompare(b.path));
	writeHits(rows);
}

export function getHits(): HitRow[] {
	if (typeof localStorage === 'undefined') return [];
	return readHits();
}

export function clearHits() {
	if (typeof localStorage === 'undefined') return;
	localStorage.removeItem(HITS_KEY);
}

export function totalHits(rows: HitRow[] = getHits()) {
	return rows.reduce((sum, row) => sum + row.count, 0);
}

function readClicks(): ClickSample[] {
	const parsed = readJson<ClickSample[]>(CLICKS_KEY, []);
	return Array.isArray(parsed) ? parsed : [];
}

function writeClicks(rows: ClickSample[]) {
	writeJson(CLICKS_KEY, rows.slice(-MAX_CLICKS));
}

function clickLabel(el: Element): string {
	const html = el as HTMLElement;
	const aria = html.getAttribute('aria-label')?.trim();
	if (aria) return aria.slice(0, 48);
	const text = (html.innerText || html.textContent || '').replace(/\s+/g, ' ').trim();
	if (text) return text.slice(0, 48);
	const id = html.id ? `#${html.id}` : '';
	const cls = typeof html.className === 'string' && html.className
		? `.${html.className.trim().split(/\s+/).slice(0, 2).join('.')}`
		: '';
	return `${html.tagName.toLowerCase()}${id}${cls}`.slice(0, 48);
}

export function trackClick(pathname: string, event: MouseEvent) {
	if (typeof localStorage === 'undefined') return;
	if (pathname.startsWith('/analytics')) return;
	if (typeof location !== 'undefined' && new URLSearchParams(location.search).get('preview') === '1')
		return;

	const target = event.target;
	if (!(target instanceof Element)) return;

	const doc = document.documentElement;
	const body = document.body;
	const docW = Math.max(doc.scrollWidth, body.scrollWidth, window.innerWidth, 1);
	const docH = Math.max(doc.scrollHeight, body.scrollHeight, window.innerHeight, 1);

	const sample: ClickSample = {
		path: pathname,
		xPct: Math.min(100, Math.max(0, (event.pageX / docW) * 100)),
		yPct: Math.min(100, Math.max(0, (event.pageY / docH) * 100)),
		vxPct: Math.min(100, Math.max(0, (event.clientX / Math.max(window.innerWidth, 1)) * 100)),
		vyPct: Math.min(100, Math.max(0, (event.clientY / Math.max(window.innerHeight, 1)) * 100)),
		tag: target.tagName.toLowerCase(),
		label: clickLabel(target),
		ts: new Date().toISOString()
	};

	const rows = readClicks();
	rows.push(sample);
	writeClicks(rows);
}

export function getClicks(): ClickSample[] {
	if (typeof localStorage === 'undefined') return [];
	return readClicks();
}

export function clearClicks() {
	if (typeof localStorage === 'undefined') return;
	localStorage.removeItem(CLICKS_KEY);
}

export function clicksForPath(path: string, rows: ClickSample[] = getClicks()) {
	return rows.filter((row) => row.path === path);
}

export function clickPaths(rows: ClickSample[] = getClicks()) {
	const map = new Map<string, number>();
	for (const row of rows) map.set(row.path, (map.get(row.path) ?? 0) + 1);
	return [...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

export function topClickTargets(rows: ClickSample[], limit = 12) {
	const map = new Map<string, { label: string; tag: string; count: number }>();
	for (const row of rows) {
		const key = `${row.tag}::${row.label}`;
		const cur = map.get(key);
		if (cur) cur.count += 1;
		else map.set(key, { label: row.label, tag: row.tag, count: 1 });
	}
	return [...map.values()].sort((a, b) => b.count - a.count).slice(0, limit);
}

/** Global click capture — Clarity-style, local only. */
export function bindClickTracking(getPath: () => string): () => void {
	const onClick = (event: MouseEvent) => {
		trackClick(getPath(), event);
	};
	document.addEventListener('click', onClick, true);
	return () => document.removeEventListener('click', onClick, true);
}
