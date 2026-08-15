<script lang="ts">
	import type { Component } from 'svelte';
	import ArrowUp from '@lucide/svelte/icons/arrow-up';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Mail from '@lucide/svelte/icons/mail';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import Menu from '@lucide/svelte/icons/menu';
	import Moon from '@lucide/svelte/icons/moon';
	import PhoneCall from '@lucide/svelte/icons/phone-call';
	import Send from '@lucide/svelte/icons/send';
	import Sun from '@lucide/svelte/icons/sun';
	import X from '@lucide/svelte/icons/x';

	type LucideProps = {
		size?: number | string;
		strokeWidth?: number | string;
		class?: string;
		'aria-hidden'?: boolean | 'true' | 'false';
	};

	const lucide = {
		phone: PhoneCall,
		mail: Mail,
		up: ArrowUp,
		send: Send,
		pin: MapPin,
		sun: Sun,
		moon: Moon,
		menu: Menu,
		close: X,
		prev: ChevronLeft,
		next: ChevronRight
	} satisfies Record<string, Component<LucideProps>>;

	type Name = keyof typeof lucide | 'facebook' | 'tiktok' | 'youtube';

	let {
		name,
		size = 22,
		class: className = ''
	}: {
		name: Name;
		size?: number;
		class?: string;
	} = $props();

	const Cmp = $derived(name in lucide ? lucide[name as keyof typeof lucide] : null);
	const strokeWidth = $derived(
		name === 'menu' || name === 'close' || name === 'prev' || name === 'next' ? 2.5 : 2.25
	);
</script>

{#if Cmp}
	<Cmp {size} {strokeWidth} class={className} aria-hidden="true" />
{:else if name === 'facebook'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="currentColor"
		class={className}
		aria-hidden="true"
	>
		<path
			d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4z"
		/>
	</svg>
{:else if name === 'tiktok'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="currentColor"
		class={className}
		aria-hidden="true"
	>
		<path
			d="M16.6 5.82A4.27 4.27 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.27 4.27 0 0 1-3.24-1.48z"
		/>
	</svg>
{:else if name === 'youtube'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="currentColor"
		class={className}
		aria-hidden="true"
	>
		<path
			d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.56A3.02 3.02 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.12 2.14c1.84.56 9.38.56 9.38.56s7.54 0 9.38-.56a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"
		/>
	</svg>
{/if}
