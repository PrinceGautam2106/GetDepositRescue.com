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
      filter: (page) =>
        !page.includes('/success') &&
        !page.includes('/404') &&
        !page.includes('/500') &&
        !page.includes('/api/'),
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
        // Enforce strict canonical URL format (clean URL, no .html, no non-root trailing slash)
        let cleanUrl = item.url.replace(/\.html$/, '');
        if (cleanUrl !== 'https://getdepositrescue.com/' && cleanUrl.endsWith('/')) {
          cleanUrl = cleanUrl.replace(/\/+$/, '');
        }
        item.url = cleanUrl;
        item.lastmod = new Date();

        if (cleanUrl === 'https://getdepositrescue.com/' || cleanUrl === 'https://getdepositrescue.com/es') {
          item.priority = 1.0;
          item.changefreq = 'daily';
        } else if (cleanUrl.includes('/calculator')) {
          item.priority = 0.9;
          item.changefreq = 'weekly';
        } else if (cleanUrl.includes('-security-deposit-law')) {
          item.priority = 0.8;
          item.changefreq = 'weekly';
        } else if (cleanUrl.includes('/about') || cleanUrl.includes('/contact')) {
          item.priority = 0.6;
          item.changefreq = 'monthly';
        } else if (cleanUrl.includes('/privacy') || cleanUrl.includes('/terms')) {
          item.priority = 0.3;
          item.changefreq = 'yearly';
        } else {
          item.priority = 0.7;
          item.changefreq = 'weekly';
        }

        // Sanitize hreflang alternate links if populated
        if (item.links && Array.isArray(item.links)) {
          item.links = item.links.map((link) => {
            let lUrl = link.url.replace(/\.html$/, '');
            if (lUrl !== 'https://getdepositrescue.com/' && lUrl.endsWith('/')) {
              lUrl = lUrl.replace(/\/+$/, '');
            }
            return { ...link, url: lUrl };
          });
        }

        return item;
      },
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
