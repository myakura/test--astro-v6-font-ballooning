// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://myakura.github.io/test--astro-v6-font-ballooning',
  base: '/test--astro-v6-font-ballooning',
  build: {
    format: 'file',
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Noto Sans JP',
      cssVariable: '--font-noto-sans-jp',
      weights: [400, 700],
      styles: ['normal'],
      subsets: ['latin', 'japanese'],
    },
  ],
});
