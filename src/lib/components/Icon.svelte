<script lang="ts">
	import type { Component } from 'svelte';
	import ArrowUpIcon from 'phosphor-svelte/lib/ArrowUpIcon';
	import CaretLeftIcon from 'phosphor-svelte/lib/CaretLeftIcon';
	import CaretRightIcon from 'phosphor-svelte/lib/CaretRightIcon';
	import EnvelopeSimpleIcon from 'phosphor-svelte/lib/EnvelopeSimpleIcon';
	import FacebookLogoIcon from 'phosphor-svelte/lib/FacebookLogoIcon';
	import ListIcon from 'phosphor-svelte/lib/ListIcon';
	import MapPinIcon from 'phosphor-svelte/lib/MapPinIcon';
	import MoonIcon from 'phosphor-svelte/lib/MoonIcon';
	import PaperPlaneTiltIcon from 'phosphor-svelte/lib/PaperPlaneTiltIcon';
	import PhoneCallIcon from 'phosphor-svelte/lib/PhoneCallIcon';
	import SunIcon from 'phosphor-svelte/lib/SunIcon';
	import TiktokLogoIcon from 'phosphor-svelte/lib/TiktokLogoIcon';
	import XIcon from 'phosphor-svelte/lib/XIcon';
	import YoutubeLogoIcon from 'phosphor-svelte/lib/YoutubeLogoIcon';

	type IconWeight = 'bold' | 'duotone' | 'fill' | 'light' | 'thin' | 'regular';

	const icons = {
		phone: PhoneCallIcon,
		mail: EnvelopeSimpleIcon,
		up: ArrowUpIcon,
		send: PaperPlaneTiltIcon,
		pin: MapPinIcon,
		sun: SunIcon,
		moon: MoonIcon,
		menu: ListIcon,
		close: XIcon,
		prev: CaretLeftIcon,
		next: CaretRightIcon,
		facebook: FacebookLogoIcon,
		tiktok: TiktokLogoIcon,
		youtube: YoutubeLogoIcon
	} satisfies Record<string, Component<{ size?: number | string; weight?: IconWeight; class?: string }>>;

	type Name = keyof typeof icons;

	let {
		name,
		size = 22,
		class: className = ''
	}: {
		name: Name;
		size?: number;
		class?: string;
	} = $props();

	const Cmp = $derived(icons[name]);
	const weight: IconWeight = $derived(
		name === 'menu' || name === 'close' || name === 'prev' || name === 'next' ? 'bold' : 'fill'
	);
</script>

<Cmp {size} {weight} class={className} aria-hidden="true" />
