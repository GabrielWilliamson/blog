// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro'
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
    site: "https://gabrielwilliamson.com/",
    integrations: [
        react(),
        markdoc(),
        keystatic(),
        sitemap()
    ],
    markdown: {
        syntaxHighlight: "shiki",
        shikiConfig: {
            theme: "github-dark",
            wrap: true,
        },
    },
    adapter: vercel(),
});
