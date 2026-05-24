import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  integrations: [tailwind(), sitemap()],
  output: 'hybrid',      // pages = static, API routes = server-side
  adapter: vercel(),
  site: 'https://atelier-toison-dor.fr',
});
