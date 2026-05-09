import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import type { Plugin } from 'vite';

function saveMonthsPlugin(): Plugin {
  return {
    name: 'save-months',
    configureServer(server) {
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
  plugins: [react(), saveMonthsPlugin()],
  test: {
    globals: true,
    environment: 'node',
  },
});
