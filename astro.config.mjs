// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Unlisted pages: noindex, and kept out of the sitemap, nav, and hubs.
const UNLISTED = ['/random-email-picker-iloamelkm/'];

export default defineConfig({
  site: 'https://financialcalculatoronlinefree.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
  output: 'static',
  // Markdown images get srcset/sizes and scale down with their container.
  image: { layout: 'constrained' },
  integrations: [react(), sitemap({ filter: (page) => !UNLISTED.some((path) => page.endsWith(path)) })],
  vite: { plugins: [tailwindcss()] },
});
