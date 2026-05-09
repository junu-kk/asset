import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import type { Plugin } from 'vite';

function dataServerPlugin(): Plugin {
  return {
    name: 'data-server',
    configureServer(server) {
      server.middlewares.use('/api/months', (req, res, next) => {
        if (req.method !== 'GET') return next();
        try {
          const filePath = resolve(server.config.root, 'src/data/months.json');
          const data = readFileSync(filePath, 'utf-8');
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(data);
        } catch {
          res.statusCode = 404;
          res.end();
        }
      });
      server.middlewares.use('/api/save-months', (req, res, next) => {
        if (req.method !== 'POST') return next();
        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });
        req.on('end', () => {
          try {
            JSON.parse(body);
            const filePath = resolve(server.config.root, 'src/data/months.json');
            writeFileSync(filePath, body);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: true }));
          } catch (e) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: false, error: String(e) }));
          }
        });
      });
    },
  };
}

export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), dataServerPlugin()],
  test: {
    globals: true,
    environment: 'node',
  },
});
