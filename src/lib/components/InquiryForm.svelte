<script lang="ts">
	import { formatSlovakDate } from '$lib/data/bookings';
	import { eventTypes, site } from '$lib/data/site';
	import Icon from '$lib/components/Icon.svelte';

	let { selectedDate = $bindable('') }: { selectedDate?: string } = $props();

	let name = $state('');
	let email = $state('');
	let phone = $state('');
	let eventType = $state<string>(eventTypes[0]);
	let place = $state('');
	let message = $state('');
	let sent = $state(false);

	const field =
		'mt-1 w-full border-2 border-ink bg-cream px-3 py-3 outline-none focus:border-paprika';

	function submit(e: SubmitEvent) {
		e.preventDefault();
		const dateLine = selectedDate ? formatSlovakDate(selectedDate) : 'dohodou';
		const subject = encodeURIComponent(`Rezervácia SEBA BAND — ${dateLine} — ${eventType}`);
		const body = encodeURIComponent(
			`Dobrý deň,\n\nchcel/a by som rezervovať SEBA BAND.\n\nMeno: ${name}\nDátum: ${dateLine}\nTyp akcie: ${eventType}\nMiesto: ${place}\nTelefón: ${phone}\nE-mail: ${email}\n\nSpráva:\n${message}\n`
		);
		sent = true;
		window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
	}
</script>

<form id="dopyt" class="border-2 border-ink bg-cream p-6 shadow-[8px_8px_0_var(--color-punch)] md:p-9" onsubmit={submit}>
	<p class="kicker">Dopyt</p>
	<h2 class="display mt-2 text-5xl">Napíšte nám</h2>
	<p class="mt-3 font-light text-ink-soft">
		Vyplňte a otvorí sa e-mail. Alebo rovno
		<a class="font-semibold text-paprika" href="tel:{site.phone}">{site.phoneDisplay}</a>
		alebo
		<a class="font-semibold text-paprika" href="mailto:{site.email}">{site.email}</a>.
	</p>

	<div class="mt-8 grid gap-4 md:grid-cols-2">
		<label class="block">
			<span class="font-display text-sm font-extrabold uppercase">Meno</span>
			<input bind:value={name} required class={field} name="name" />
		</label>
		<label class="block">
			<span class="font-display text-sm font-extrabold uppercase">Telefón</span>
			<input bind:value={phone} required type="tel" class={field} name="phone" />
		</label>
		<label class="block">
			<span class="font-display text-sm font-extrabold uppercase">E-mail</span>
			<input bind:value={email} required type="email" class={field} name="email" />
		</label>
		<label class="block">
			<span class="font-display text-sm font-extrabold uppercase">Typ akcie</span>
			<select bind:value={eventType} class={field} name="eventType">
				{#each eventTypes as type (type)}
					<option value={type}>{type}</option>
				{/each}
			</select>
		</label>
		<label class="block">
			<span class="font-display text-sm font-extrabold uppercase">Dátum</span>
			<input bind:value={selectedDate} type="date" class={field} name="date" />
		</label>
		<label class="block">
			<span class="font-display text-sm font-extrabold uppercase">Miesto</span>
			<input bind:value={place} required class={field} name="place" placeholder="Mesto, sála, krajina" />
		</label>
		<label class="block md:col-span-2">
			<span class="font-display text-sm font-extrabold uppercase">Správa</span>
			<textarea
				bind:value={message}
				rows="4"
				class={field}
				name="message"
				placeholder="Čas začiatku, počet hostí, repertoár…"
			></textarea>
		</label>
	</div>

	<div class="mt-7 flex flex-wrap gap-3">
		<button type="submit" class="btn-hot"><Icon name="send" size={18} /> Odoslať dopyt</button>
		<a class="btn-ink" href="tel:{site.phone}"><Icon name="phone" size={18} /> Zavolať</a>
	</div>

	{#if sent}
		<p class="mt-4 text-sm text-paprika-deep">
			Otvára sa e-mail. Ak sa nič nestalo, napíšte na {site.email}.
		</p>
	{/if}
</form>
