// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://seoulceuticals.com',
  devToolbar: { enabled: false },
  build: { inlineStylesheets: 'auto' },
});
