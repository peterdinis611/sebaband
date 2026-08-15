# SEBA BAND

Oficiálny web rómskej live kapely — rezervácie, galéria, videá a kontakt.

**Stack:** SvelteKit 2 · Svelte 5 · TypeScript · Tailwind CSS 4 · anime.js · Phosphor Icons

## Spustenie

```bash
npm install
npm run dev
```

Dev server: [http://localhost:5173](http://localhost:5173)

## Skripty

| Príkaz | Popis |
| --- | --- |
| `npm run dev` | Lokálny vývoj |
| `npm run build` | Produkčný build |
| `npm run preview` | Náhľad buildu |
| `npm run check` | TypeScript + Svelte kontrola |
| `npm run lint` | ESLint + Prettier |
| `npm run format` | Formátovanie kódu |
| `npm test` | Playwright E2E |
| `npm run test:ui` | Playwright UI režim |
| `npm run test:stress` | UI stress (rýchla navigácia, lightbox, téma…) |
| `npm run test:load` | HTTP load stress (preview musí bežať) |

## Štruktúra

```
src/
  lib/
    components/   # UI (header, galéria, kalendár, lightbox…)
    data/         # Obsah webu (kontakt, termíny, fotky, videá)
    motion.ts     # Animácie
  routes/         # Stránky (SvelteKit)
static/images/    # Fotografie (WebP + JPEG)
```

### Stránky

| Cesta | Obsah |
| --- | --- |
| `/` | Domov |
| `/o-nas` | O kapele |
| `/galeria` | Fotogaléria |
| `/videa` | YouTube videá |
| `/rezervacie` | Kalendár termínov |
| `/kontakt` | Kontakt |
| `/rezervacne-podmienky` | Podmienky rezervácie |
| `/analytics` | Interný prehľad (nie je v menu) |

## Testy (Playwright)

```bash
npx playwright install chromium   # raz
npm test
```

| Príkaz | Popis |
| --- | --- |
| `npm test` | E2E testy (build + preview) |
| `npm run test:ui` | Playwright UI |
| `npm run test:headed` | Testy v otvorenom prehliadači |
| `npm run test:stress` | UI stress suite |
| `npm run test:load` | HTTP load stress |

Špecifikácie sú v `e2e/` — stránky, navigácia, kontakt bez dopytu, rezervácie, galéria/lightbox, téma.

### Stress

```bash
npm run test:stress          # agresívne UI scenáre (e2e/stress)
npm run build && npm run preview -- --host 127.0.0.1 --port 4173
# v druhom termináli:
npm run test:load            # HTTP load (40 klientov, 20s)
npm run test:load:heavy      # 80 klientov, 45s
```

Env pre load: `BASE_URL`, `CONCURRENCY`, `DURATION_MS`.

## Dizajn

Svetlý newsprint / concert-poster look: paprika akcent, Big Shoulders Display + Fraunces, tvrdý ink shadow. Tmavý režim cez `data-theme` (persistuje v `localStorage`).

## Nasadenie

```bash
npm run build
```

Adapter je `@sveltejs/adapter-auto` — pri hostingu (Vercel, Netlify, Node…) prípadne vymeň adapter v `vite.config.ts` / SvelteKit konfigurácii.
