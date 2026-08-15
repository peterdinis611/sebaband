<script lang="ts">
	import { page } from '$app/state';
	import { nav, site } from '$lib/data/site';
	import { playHeader, playMobileNav } from '$lib/motion';
	import { theme, toggleTheme } from '$lib/theme.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { boot } from '$lib/boot.svelte';

	let open = $state(false);
	let compact = $state(false);
	let headerEl = $state<HTMLElement>();
	let mobileNav = $state<HTMLElement>();

	$effect(() => {
		if (!headerEl || boot.locked) return;
		return playHeader(headerEl);
	});

	$effect(() => {
		if (!open || !mobileNav) return;
		return playMobileNav(mobileNav);
	});

	$effect(() => {
		void page.url.pathname;
		open = false;
	});

	$effect(() => {
		const onScroll = () => {
			compact = window.scrollY > 16;
		};
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});

	function isActive(href: string) {
		if (href === '/') return page.url.pathname === '/';
		return page.url.pathname.startsWith(href);
	}
</script>

<header
	bind:this={headerEl}
	class="fixed inset-x-0 top-0 z-[60] border-b-2 border-ink transition-colors {compact
		? 'bg-paper/92 backdrop-blur-md'
		: 'bg-paper'}"
>
	<div class="mx-auto flex max-w-[90rem] items-center justify-between gap-4 px-4 py-3 md:px-7">
		<a href="/" class="flex items-center gap-2 no-underline">
			<img
				src="/images/logo.webp"
				alt=""
				width="40"
				height="40"
				class="brand-mark h-10 w-10 mix-blend-multiply"
			/>
			<span class="display text-2xl text-ink md:text-3xl">{site.name}</span>
		</a>

		<nav class="hidden items-center gap-5 xl:flex" aria-label="Hlavná navigácia">
			{#each nav as item (item.href)}
				<a
					href={item.href}
					class="font-display text-lg font-extrabold uppercase tracking-wide no-underline {isActive(
						item.href
					)
						? 'text-paprika underline decoration-2 underline-offset-4'
						: 'text-ink hover:text-paprika'}"
				>
					{item.label}
				</a>
			{/each}
		</nav>

		<div class="flex items-center gap-2">
			<button
				type="button"
				class="theme-toggle"
				onclick={(e) => toggleTheme(e.currentTarget)}
				aria-label={theme.mode === 'dark' ? 'Zapnúť svetlý režim' : 'Zapnúť tmavý režim'}
				title={theme.mode === 'dark' ? 'Svetlý režim' : 'Tmavý režim'}
			>
				{#if theme.mode === 'dark'}
					<Icon name="sun" size={20} />
				{:else}
					<Icon name="moon" size={20} />
				{/if}
			</button>
			<a href="tel:{site.phone}" class="btn-hot hidden !py-2 !text-base lg:inline-flex"
				><Icon name="phone" size={16} /> Volajte</a
			>
			<button
				type="button"
				class="grid h-11 w-11 place-items-center border-2 border-ink bg-cream xl:hidden"
				aria-expanded={open}
				aria-controls="mobile-nav"
				onclick={() => (open = !open)}
			>
				<span class="sr-only">{open ? 'Zavrieť menu' : 'Otvoriť menu'}</span>
				<Icon name={open ? 'close' : 'menu'} size={20} />
			</button>
		</div>
	</div>

	{#if open}
		<nav
			bind:this={mobileNav}
			id="mobile-nav"
			class="border-t-2 border-ink bg-cream px-5 py-6 xl:hidden"
			aria-label="Mobilná navigácia"
		>
			<div class="flex flex-col gap-3">
				{#each nav as item (item.href)}
					<a
						href={item.href}
						class="display text-3xl no-underline {isActive(item.href) ? 'text-paprika' : 'text-ink'}"
					>
						{item.label}
					</a>
				{/each}
				<a href="tel:{site.phone}" class="btn-hot mt-3 w-full"
					><Icon name="phone" size={18} /> {site.phoneDisplay}</a
				>
			</div>
		</nav>
	{/if}
</header>
