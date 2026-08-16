<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { nav } from '$lib/data/site';
	import { prefersLightMotion } from '$lib/motion-prefs';

	const order = [
		'/',
		'/o-nas',
		'/galeria',
		'/videa',
		'/rezervacie',
		'/kontakt',
		'/rezervacne-podmienky'
	];

	let root = $state<HTMLElement>();

	function labelFor(pathname: string) {
		if (pathname === '/') return 'Domov';
		if (pathname.startsWith('/analytics')) return 'Analytics';
		const item = nav.find((n) => n.href !== '/' && pathname.startsWith(n.href));
		if (item) return item.label;
		if (pathname.startsWith('/rezervacne-podmienky')) return 'Podmienky';
		return 'SEBA';
	}

	function indexFor(pathname: string) {
		const exact = order.indexOf(pathname);
		if (exact >= 0) return exact;
		return order.findIndex((path) => path !== '/' && pathname.startsWith(path));
	}

	onNavigate((navigation) => {
		const from = navigation.from?.url.pathname;
		const to = navigation.to?.url.pathname;
		if (!from || !to || from === to) return;
		if (prefersLightMotion() || !root) return;

		const direction: 1 | -1 = indexFor(to) >= indexFor(from) ? 1 : -1;
		const label = labelFor(to);
		const el = root;

		return import('$lib/motion').then(({ coverPageTurn, revealPageTurn }) =>
			coverPageTurn(el, { direction, label }).then(
				() => () => {
					void revealPageTurn(el, { direction });
				},
				() => {
					el.dataset.on = '0';
					document.documentElement.classList.remove('is-turning');
				}
			)
		);
	});
</script>

<div bind:this={root} class="page-curtain" data-on="0" aria-hidden="true">
	<div class="js-turn-slash page-curtain-layer page-curtain-slash-wrap">
		<div class="page-curtain-slash"></div>
	</div>
	<div class="js-turn-ink page-curtain-layer">
		<div class="page-curtain-ink"></div>
	</div>
	<div class="js-turn-sheet page-curtain-layer">
		<div class="page-curtain-fill">
			<div class="page-curtain-copy">
				<p class="page-curtain-kicker js-turn-kicker">SEBA BAND</p>
				<p class="page-curtain-title js-turn-type">Domov</p>
				<span class="page-curtain-stamp js-turn-stamp">Naživo</span>
			</div>
		</div>
	</div>
</div>
