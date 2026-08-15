<script lang="ts">
	let {
		title,
		description,
		noindex = false
	}: {
		title: string;
		description?: string;
		noindex?: boolean;
	} = $props();
</script>

<svelte:head>
	<title>{title}</title>
	{#if noindex}
		<meta name="robots" content="noindex, nofollow" />
	{/if}
	{#if description}
		<meta name="description" content={description} />
		<meta property="og:description" content={description} />
	{/if}
	<meta property="og:title" content={title} />
	<meta property="og:type" content="website" />
	<meta name="twitter:title" content={title} />
	{#if description}
		<meta name="twitter:description" content={description} />
	{/if}
</svelte:head>
