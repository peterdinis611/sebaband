<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import { site } from '$lib/data/site';
</script>

<footer class="border-t-2 border-ink bg-pine text-foam">
	<div class="mx-auto grid max-w-[90rem] gap-10 px-4 py-16 md:grid-cols-12 md:px-7" data-in-stagger>
		<div class="md:col-span-5">
			<p class="display text-5xl text-foam">{site.name}</p>
			<p class="mt-3 max-w-sm font-light text-foam/80">
				Svadby, oslavy, plesy, zábavy, festivaly a firemné akcie na Slovensku aj v zahraničí.
			</p>
		</div>
		<div class="md:col-span-3">
			<p class="kicker !text-paprika">Kontakt</p>
			<ul class="mt-4 space-y-2">
				<li>
					<a class="footer-link" href="tel:{site.phone}"
						><Icon name="phone" size={16} /> {site.phoneDisplay}</a
					>
				</li>
				<li>
					<a class="footer-link" href="mailto:{site.email}"
						><Icon name="mail" size={16} /> {site.email}</a
					>
				</li>
				<li>
					<a class="footer-link" href="/rezervacie#dopyt"><Icon name="send" size={16} /> Dopyt</a>
				</li>
				<li>
					<a class="text-foam no-underline hover:text-paprika" href="/rezervacne-podmienky"
						>Podmienky</a
					>
				</li>
			</ul>
		</div>
		<div class="md:col-span-4">
			<p class="kicker !text-paprika">Sledujte</p>
			<div class="mt-4 flex flex-wrap gap-2">
				<a
					class="btn-ink !border-foam !text-foam hover:!bg-foam hover:!text-pine"
					href={site.facebook}
					rel="noreferrer"
					target="_blank"><Icon name="facebook" size={18} /> Facebook</a
				>
				<a
					class="btn-ink !border-foam !text-foam hover:!bg-foam hover:!text-pine"
					href={site.tiktok}
					rel="noreferrer"
					target="_blank"><Icon name="tiktok" size={18} /> TikTok</a
				>
				<a
					class="btn-ink !border-foam !text-foam hover:!bg-foam hover:!text-pine"
					href={site.youtube}
					rel="noreferrer"
					target="_blank"><Icon name="youtube" size={18} /> YouTube</a
				>
			</div>
		</div>
	</div>
	<div class="border-t-2 border-foam/20 px-4 py-4 text-sm text-foam/60 md:px-7">
		© {new Date().getFullYear()} {site.name}
	</div>
</footer>
