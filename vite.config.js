import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { readdirSync } from 'node:fs';

const root = import.meta.dirname;
const pages = Object.fromEntries(
  readdirSync(root)
    .filter((f) => f.endsWith('.html'))
    .map((f) => [f.replace('.html', ''), resolve(root, f)])
);

export default defineConfig({
  // GitHub Pages project site: https://shmuli1kriger.github.io/TheGymnasticsCrew/
  base: '/TheGymnasticsCrew/',
  build: { rollupOptions: { input: pages } },
});
