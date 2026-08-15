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
| `/kontakt` | Kontakt + dopyt |
| `/rezervacne-podmienky` | Podmienky rezervácie |

## Dizajn

Svetlý newsprint / concert-poster look: paprika akcent, Big Shoulders Display + Fraunces, tvrdý ink shadow. Tmavý režim cez `data-theme` (persistuje v `localStorage`).

## Nasadenie

```bash
npm run build
```

Adapter je `@sveltejs/adapter-auto` — pri hostingu (Vercel, Netlify, Node…) prípadne vymeň adapter v `vite.config.ts` / SvelteKit konfigurácii.
