<script lang="ts">
	import { formatSlovakDate } from '$lib/data/bookings';
	import { eventTypes, site } from '$lib/data/site';
	import Icon from '$lib/components/Icon.svelte';
	import {
		firstErrorField,
		normalizePhone,
		type InquiryErrors,
		type InquiryField,
		type InquiryValues,
		validateField,
		validateInquiry
	} from '$lib/inquiry';

	let { selectedDate = $bindable('') }: { selectedDate?: string } = $props();

	let name = $state('');
	let email = $state('');
	let phone = $state('');
	let eventType = $state<string>(eventTypes[0]);
	let place = $state('');
	let message = $state('');
	let sent = $state(false);
	let tried = $state(false);
	let errors = $state<InquiryErrors>({});
	let touched = $state<Partial<Record<InquiryField, boolean>>>({});

	const values = $derived.by(
		(): InquiryValues => ({
			name,
			phone,
			email,
			eventType,
			date: selectedDate,
			place,
			message
		})
	);

	const errorCount = $derived(Object.keys(errors).length);
	const dateLabel = $derived(selectedDate ? formatSlovakDate(selectedDate) : '');
	const msgLen = $derived(message.trim().length);

	function mark(key: InquiryField) {
		touched = { ...touched, [key]: true };
	}

	function check(key: InquiryField) {
		mark(key);
		const next = { ...errors };
		const err = validateField(key, {
			name,
			phone,
			email,
			eventType,
			date: selectedDate,
			place,
			message
		});
		if (err) next[key] = err;
		else delete next[key];
		errors = next;
	}

	function syncDateError() {
		if (!tried && !touched.date) return;
		const next = { ...errors };
		const err = validateField('date', {
			name,
			phone,
			email,
			eventType,
			date: selectedDate,
			place,
			message
		});
		if (err) next.date = err;
		else delete next.date;
		errors = next;
	}

	$effect(() => {
		void selectedDate;
		syncDateError();
	});

	function submit(e: SubmitEvent) {
		e.preventDefault();
		tried = true;
		touched = {
			name: true,
			phone: true,
			email: true,
			eventType: true,
			date: true,
			place: true,
			message: true
		};

		const next = validateInquiry(values);
		errors = next;
		if (Object.keys(next).length) {
			sent = false;
			const first = firstErrorField(next);
			if (first) {
				queueMicrotask(() => {
					document.getElementById(`inquiry-${first}`)?.focus();
				});
			}
			return;
		}

		const dateLine = selectedDate ? formatSlovakDate(selectedDate) : 'dohodou';
		const phoneNorm = normalizePhone(phone);
		const subject = encodeURIComponent(`Rezervácia SEBA BAND — ${dateLine} — ${eventType}`);
		const body = encodeURIComponent(
			`Dobrý deň,\n\nchcel/a by som rezervovať SEBA BAND.\n\nMeno: ${name.trim()}\nDátum: ${dateLine}\nTyp akcie: ${eventType}\nMiesto: ${place.trim()}\nTelefón: ${phoneNorm}\nE-mail: ${email.trim()}\n\nSpráva:\n${message.trim() || '—'}\n`
		);
		sent = true;
		window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
	}
</script>

<form id="dopyt" class="inquiry" class:inquiry-bad={tried && errorCount > 0} novalidate onsubmit={submit}>
	<div class="inquiry-head">
		<div>
			<p class="kicker">Dopyt</p>
			<h2 class="display mt-2 text-[clamp(2.4rem,8vw,3.4rem)] leading-[0.88]">Napíšte nám</h2>
		</div>
		{#if dateLabel}
			<span class="inquiry-stamp">{dateLabel}</span>
		{/if}
	</div>

	<p class="inquiry-lede">
		Vyplňte lístok — otvorí sa e-mail. Alebo rovno
		<a href="tel:{site.phone}">{site.phoneDisplay}</a>
		/
		<a href="mailto:{site.email}">{site.email}</a>.
	</p>

	{#if tried && errorCount > 0}
		<div class="inquiry-alert" role="alert" aria-live="polite">
			<span class="inquiry-alert-mark" aria-hidden="true">!</span>
			<div>
				<p class="inquiry-alert-title">Skontrolujte lístok</p>
				<p>
					{errorCount === 1
						? 'Jedno pole treba doplniť pred odoslaním.'
						: `${errorCount} polia treba doplniť pred odoslaním.`}
				</p>
			</div>
		</div>
	{/if}

	{#if sent && errorCount === 0}
		<div class="inquiry-ok" role="status">
			<span class="inquiry-alert-mark" aria-hidden="true">✓</span>
			<div>
				<p class="inquiry-alert-title">E-mail sa otvára</p>
				<p>Ak sa nič nestalo, napíšte na {site.email}.</p>
			</div>
		</div>
	{/if}

	<div class="inquiry-grid">
		<label class="inquiry-field" class:is-bad={!!errors.name}>
			<span class="inquiry-label">Meno <i>*</i></span>
			<input
				id="inquiry-name"
				bind:value={name}
				name="name"
				autocomplete="name"
				maxlength="80"
				placeholder="Ján Novák"
				aria-invalid={errors.name ? 'true' : 'false'}
				aria-describedby={errors.name ? 'err-name' : undefined}
				onblur={() => check('name')}
				oninput={() => touched.name && check('name')}
			/>
			{#if errors.name}
				<span id="err-name" class="inquiry-err">{errors.name}</span>
			{/if}
		</label>

		<label class="inquiry-field" class:is-bad={!!errors.phone}>
			<span class="inquiry-label">Telefón <i>*</i></span>
			<input
				id="inquiry-phone"
				bind:value={phone}
				type="tel"
				name="phone"
				autocomplete="tel"
				inputmode="tel"
				placeholder="+421 911 601 868"
				maxlength="24"
				aria-invalid={errors.phone ? 'true' : 'false'}
				aria-describedby={errors.phone ? 'err-phone' : undefined}
				onblur={() => check('phone')}
				oninput={() => touched.phone && check('phone')}
			/>
			{#if errors.phone}
				<span id="err-phone" class="inquiry-err">{errors.phone}</span>
			{/if}
		</label>

		<label class="inquiry-field" class:is-bad={!!errors.email}>
			<span class="inquiry-label">E-mail <i>*</i></span>
			<input
				id="inquiry-email"
				bind:value={email}
				type="email"
				name="email"
				autocomplete="email"
				inputmode="email"
				placeholder="meno@domena.sk"
				maxlength="120"
				aria-invalid={errors.email ? 'true' : 'false'}
				aria-describedby={errors.email ? 'err-email' : undefined}
				onblur={() => check('email')}
				oninput={() => touched.email && check('email')}
			/>
			{#if errors.email}
				<span id="err-email" class="inquiry-err">{errors.email}</span>
			{/if}
		</label>

		<label class="inquiry-field" class:is-bad={!!errors.eventType}>
			<span class="inquiry-label">Typ akcie <i>*</i></span>
			<select
				id="inquiry-eventType"
				bind:value={eventType}
				name="eventType"
				aria-invalid={errors.eventType ? 'true' : 'false'}
				aria-describedby={errors.eventType ? 'err-eventType' : undefined}
				onblur={() => check('eventType')}
				onchange={() => check('eventType')}
			>
				{#each eventTypes as type (type)}
					<option value={type}>{type}</option>
				{/each}
			</select>
			{#if errors.eventType}
				<span id="err-eventType" class="inquiry-err">{errors.eventType}</span>
			{/if}
		</label>

		<label class="inquiry-field" class:is-bad={!!errors.date}>
			<span class="inquiry-label">Dátum <i>*</i></span>
			<input
				id="inquiry-date"
				bind:value={selectedDate}
				type="date"
				name="date"
				aria-invalid={errors.date ? 'true' : 'false'}
				aria-describedby={errors.date ? 'err-date' : 'hint-date'}
				onblur={() => check('date')}
				onchange={() => check('date')}
			/>
			{#if errors.date}
				<span id="err-date" class="inquiry-err">{errors.date}</span>
			{:else}
				<span id="hint-date" class="inquiry-hint">Alebo kliknite voľný deň v kalendári.</span>
			{/if}
		</label>

		<label class="inquiry-field" class:is-bad={!!errors.place}>
			<span class="inquiry-label">Miesto <i>*</i></span>
			<input
				id="inquiry-place"
				bind:value={place}
				name="place"
				placeholder="Mesto, sála, krajina"
				maxlength="120"
				autocomplete="address-level2"
				aria-invalid={errors.place ? 'true' : 'false'}
				aria-describedby={errors.place ? 'err-place' : undefined}
				onblur={() => check('place')}
				oninput={() => touched.place && check('place')}
			/>
			{#if errors.place}
				<span id="err-place" class="inquiry-err">{errors.place}</span>
			{/if}
		</label>

		<label class="inquiry-field inquiry-field-wide" class:is-bad={!!errors.message}>
			<span class="inquiry-label">
				Správa
				<span class="inquiry-count">{msgLen}/2000</span>
			</span>
			<textarea
				id="inquiry-message"
				bind:value={message}
				rows="4"
				name="message"
				placeholder="Čas začiatku, počet hostí, repertoár…"
				maxlength="2000"
				aria-invalid={errors.message ? 'true' : 'false'}
				aria-describedby={errors.message ? 'err-message' : undefined}
				onblur={() => check('message')}
				oninput={() => touched.message && check('message')}
			></textarea>
			{#if errors.message}
				<span id="err-message" class="inquiry-err">{errors.message}</span>
			{/if}
		</label>
	</div>

	<div class="inquiry-actions">
		<button type="submit" class="btn-hot w-full sm:w-auto"
			><Icon name="send" size={18} /> Odoslať dopyt</button
		>
		<a class="btn-ink w-full sm:w-auto" href="tel:{site.phone}"
			><Icon name="phone" size={18} /> Zavolať</a
		>
	</div>
</form>

<style>
	.inquiry {
		position: relative;
		border: 2px solid var(--color-ink);
		background:
			linear-gradient(135deg, color-mix(in srgb, var(--color-paprika) 7%, transparent), transparent 42%),
			var(--color-cream);
		padding: 1.15rem 1rem 1.35rem;
		box-shadow: 8px 8px 0 var(--color-punch);
		overflow: hidden;
	}

	@media (min-width: 640px) {
		.inquiry {
			padding: 1.6rem 1.5rem 1.75rem;
		}
	}

	@media (min-width: 768px) {
		.inquiry {
			padding: 2rem 2.1rem 2.15rem;
		}
	}

	.inquiry::before {
		content: '';
		position: absolute;
		inset: 0.55rem;
		border: 1px dashed color-mix(in srgb, var(--color-ink) 28%, transparent);
		pointer-events: none;
	}

	.inquiry-bad {
		box-shadow: 8px 8px 0 var(--color-paprika);
	}

	.inquiry-head {
		position: relative;
		z-index: 1;
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
	}

	.inquiry-stamp {
		flex-shrink: 0;
		margin-top: 0.35rem;
		border: 2px solid var(--color-paprika);
		color: var(--color-paprika);
		padding: 0.35rem 0.55rem;
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.72rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		transform: rotate(6deg);
		max-width: 8.5rem;
		text-align: center;
		line-height: 1.2;
		background: color-mix(in srgb, var(--color-cream) 88%, var(--color-paprika));
	}

	.inquiry-lede {
		position: relative;
		z-index: 1;
		margin: 0.85rem 0 0;
		max-width: 36rem;
		font-weight: 300;
		color: var(--color-ink-soft);
		font-size: 0.98rem;
	}

	.inquiry-lede a {
		font-weight: 600;
		color: var(--color-paprika);
		text-decoration: none;
		overflow-wrap: anywhere;
	}

	.inquiry-lede a:hover {
		text-decoration: underline;
	}

	.inquiry-alert,
	.inquiry-ok {
		position: relative;
		z-index: 1;
		display: flex;
		gap: 0.75rem;
		align-items: flex-start;
		margin-top: 1.1rem;
		padding: 0.85rem 0.95rem;
		border: 2px solid var(--color-paprika);
		background: color-mix(in srgb, var(--color-paprika) 12%, var(--color-cream));
		box-shadow: 4px 4px 0 var(--color-paprika);
	}

	.inquiry-ok {
		border-color: var(--color-pine);
		background: color-mix(in srgb, var(--color-pine) 12%, var(--color-cream));
		box-shadow: 4px 4px 0 var(--color-pine);
	}

	.inquiry-alert-mark {
		display: grid;
		place-items: center;
		width: 1.7rem;
		height: 1.7rem;
		flex-shrink: 0;
		border: 2px solid currentColor;
		font-family: var(--font-display);
		font-weight: 900;
		font-size: 1rem;
		color: var(--color-paprika);
	}

	.inquiry-ok .inquiry-alert-mark {
		color: var(--color-pine);
	}

	.inquiry-alert-title {
		margin: 0;
		font-family: var(--font-display);
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		font-size: 0.9rem;
		color: var(--color-paprika);
	}

	.inquiry-ok .inquiry-alert-title {
		color: var(--color-pine);
	}

	.inquiry-alert p,
	.inquiry-ok p {
		margin: 0.2rem 0 0;
		font-size: 0.92rem;
		font-weight: 300;
		color: var(--color-ink-soft);
	}

	.inquiry-grid {
		position: relative;
		z-index: 1;
		display: grid;
		gap: 0.95rem;
		margin-top: 1.35rem;
	}

	@media (min-width: 768px) {
		.inquiry-grid {
			grid-template-columns: 1fr 1fr;
			gap: 1rem 1.1rem;
		}

		.inquiry-field-wide {
			grid-column: 1 / -1;
		}
	}

	.inquiry-field {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		min-width: 0;
	}

	.inquiry-label {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.5rem;
		font-family: var(--font-display);
		font-size: 0.8rem;
		font-weight: 800;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-ink);
	}

	.inquiry-label i {
		font-style: normal;
		color: var(--color-paprika);
	}

	.inquiry-count {
		font-size: 0.7rem;
		letter-spacing: 0.06em;
		color: var(--color-dust);
		font-weight: 700;
	}

	.inquiry-field :global(input),
	.inquiry-field :global(select),
	.inquiry-field :global(textarea) {
		width: 100%;
		border: 2px solid color-mix(in srgb, var(--color-ink) 55%, transparent);
		background: color-mix(in srgb, var(--color-paper) 55%, var(--color-cream));
		color: var(--color-ink);
		padding: 0.78rem 0.85rem;
		outline: none;
		font: inherit;
		transition:
			border-color 0.15s ease,
			box-shadow 0.15s ease,
			background 0.15s ease;
	}

	.inquiry-field :global(textarea) {
		resize: vertical;
		min-height: 7rem;
	}

	.inquiry-field :global(input::placeholder),
	.inquiry-field :global(textarea::placeholder) {
		color: var(--color-dust);
		opacity: 0.85;
	}

	.inquiry-field :global(input:hover),
	.inquiry-field :global(select:hover),
	.inquiry-field :global(textarea:hover) {
		border-color: var(--color-ink);
	}

	.inquiry-field :global(input:focus),
	.inquiry-field :global(select:focus),
	.inquiry-field :global(textarea:focus) {
		border-color: var(--color-paprika);
		box-shadow: 3px 3px 0 color-mix(in srgb, var(--color-paprika) 45%, transparent);
		background: var(--color-cream);
	}

	.inquiry-field.is-bad :global(input),
	.inquiry-field.is-bad :global(select),
	.inquiry-field.is-bad :global(textarea) {
		border-color: var(--color-paprika);
		background: color-mix(in srgb, var(--color-paprika) 8%, var(--color-cream));
		box-shadow: 3px 3px 0 var(--color-paprika);
	}

	.inquiry-err {
		font-size: 0.82rem;
		line-height: 1.35;
		color: var(--color-paprika);
		font-weight: 500;
	}

	.inquiry-hint {
		font-size: 0.75rem;
		color: var(--color-dust);
	}

	.inquiry-actions {
		position: relative;
		z-index: 1;
		display: flex;
		flex-wrap: wrap;
		gap: 0.65rem;
		margin-top: 1.35rem;
		padding-top: 1.1rem;
		border-top: 2px dashed color-mix(in srgb, var(--color-ink) 22%, transparent);
	}

	:global([data-theme='dark']) .inquiry {
		background:
			linear-gradient(135deg, color-mix(in srgb, var(--color-paprika) 10%, transparent), transparent 48%),
			var(--color-cream);
	}

	:global([data-theme='dark']) .inquiry-stamp {
		background: color-mix(in srgb, var(--color-cream) 70%, var(--color-paprika));
	}
</style>
