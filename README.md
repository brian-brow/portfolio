# portfolio

Brian Brown's personal site: a calm, single-screen page with a dithered Van Gogh skull.

Ported from the Claude Design prototype into Vite + React + TypeScript.

## Run

```sh
bun install
bun run dev      # http://localhost:5173
bun run build    # type-check + production build into dist/
```

(npm works too: `npm install`, `npm run dev`.)

## Where things live

| What | Where |
| --- | --- |
| All copy: projects, experience, posts, socials, skull sayings | `src/content.ts` |
| Colors for dark and light mode | `src/theme.ts` |
| Page layout and tab switching | `src/App.tsx` |
| Skull image, cigarette embers, speech | `src/components/Skull.tsx` |
| Falling sand playground | `src/components/SandZone.tsx` |
| Dithered wipe used for tabs and speech | `src/lib/ditherWipe.ts` |
| Theme swap (boxes that dither from one theme into the other) | `src/lib/themeSwap.ts` |
| Dithered skull images (background pixels transparent) | `public/skull-dark.png`, `public/skull-light.png` |

## TODO

- X and YouTube links in `src/content.ts`
- Real posts (two placeholders in `POSTS`)
- Phone layout
