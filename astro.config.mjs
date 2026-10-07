// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Sitenin adresi (RSS ve site haritası tam adresleri buradan üretir)
  site: 'https://baranipek.com',
  integrations: [sitemap()],
});
