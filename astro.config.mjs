// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Domain belli olunca buraya yazılacak (RSS ve site haritası için gerekli).
  // site: 'https://ornek.com',
  integrations: [sitemap()],
});
