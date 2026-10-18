// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'https://getdepositrescue.com',
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },

  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: false,
    },
  },

  integrations: [
    sitemap({
      filter: (page) => !page.includes('/success') && !page.includes('/404') && !page.includes('/500'),
      xslURL: '/sitemap.xsl',
      lastmod: new Date(),
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-US',
          es: 'es-US',
        },
      },
      serialize(item) {
        const url = item.url;
        item.lastmod = new Date();

        if (url === 'https://getdepositrescue.com/' || url === 'https://getdepositrescue.com/es') {
          item.priority = 1.0;
          item.changefreq = 'daily';
        } else if (url.includes('/calculator')) {
          item.priority = 0.9;
          item.changefreq = 'weekly';
        } else if (url.includes('-security-deposit-law')) {
          item.priority = 0.8;
          item.changefreq = 'weekly';
        } else if (url.includes('/about') || url.includes('/contact')) {
          item.priority = 0.6;
          item.changefreq = 'monthly';
        } else if (url.includes('/privacy') || url.includes('/terms')) {
          item.priority = 0.3;
          item.changefreq = 'yearly';
        } else {
          item.priority = 0.7;
          item.changefreq = 'weekly';
        }

        return item;
      },
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
