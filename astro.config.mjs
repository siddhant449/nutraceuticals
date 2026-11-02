// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages builds set SITE and BASE_PATH (see .github/workflows/deploy.yml); local dev stays at /.
export default defineConfig({
  site: process.env.SITE ?? 'https://seoulceuticals.com',
  base: process.env.BASE_PATH ?? '/',
  devToolbar: { enabled: false },
  build: { inlineStylesheets: 'auto' },
});
