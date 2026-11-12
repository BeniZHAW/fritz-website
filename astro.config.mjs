// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

// PUBLIC_PREVIEW=true: Vorschau auf GitHub Pages (Unterpfad, noindex).
const isPreview = loadEnv('', '.', 'PUBLIC_').PUBLIC_PREVIEW === 'true';

export default defineConfig({
  site: isPreview ? 'https://benizhaw.github.io' : 'https://pommes-fritz.ch',
  base: isPreview ? '/fritz-website' : undefined,
  trailingSlash: 'never',
  build: { format: 'file' },
  server: { port: 4321 },
  devToolbar: { enabled: false },
});
