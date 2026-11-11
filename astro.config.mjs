// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://pommes-fritz.ch',
  trailingSlash: 'never',
  build: { format: 'file' },
  server: { port: 4321 },
  devToolbar: { enabled: false },
});
