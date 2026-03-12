# Astro Font Ballooning — Minimal Repro

Minimal reproduction for a bug where Astro's built-in font optimization with **Noto Sans JP** causes Latin text to render much larger than its final size during the fallback phase, before the web font swap completes.

## Install and run

```sh
npm install
npm run dev
```

Then open `http://localhost:4321` in Chrome.

## How to reproduce

1. Open the page in Chrome.
2. Open DevTools → Network tab → set throttling to **Slow 3G** (or use **Hard Reload** via Shift+Reload).
3. Reload the page.
4. Observe that the large `"Astro Font"` heading appears noticeably oversized before shrinking to its final size once the web fonts finish loading.

> **Tip:** The effect is easiest to see with network throttling enabled, since the fallback stays visible long enough to notice clearly. A hard reload (`Cmd+Shift+R` / `Ctrl+Shift+F5`) also helps by bypassing the font cache.

## What the bug looks like

The English heading temporarily balloons to a much larger size before the final Noto Sans JP font is applied. This is **not** a normal `font-display: swap` size difference — the generated optimized fallback face uses an extreme `size-adjust` value (around `197%`) that makes Latin text appear dramatically oversized before the swap completes.

The generated fallback `@font-face` in the built HTML looks like:

```css
@font-face {
  font-family: "Noto Sans JP-... fallback: Arial";
  src: local("Arial");
  size-adjust: 197.1733%;
  ascent-override: 58.8315%;
  descent-override: 14.6064%;
  line-gap-override: 0%;
}
```

A correct Latin-to-Latin `size-adjust` for this font should be closer to `103–105%`, not `~197%`.

## Suspected cause

Astro's font pipeline caches preferred metrics only by family name, not by subset. This means a CJK subset metrics object can be reused when generating the fallback for the Latin subset, producing a wildly incorrect `size-adjust` for Latin text.
