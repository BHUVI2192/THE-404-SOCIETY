import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import type { IncomingMessage, ServerResponse } from 'http';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        // Dev-only middleware: proxies /api/create-order so UPI works during local development.
        // In production this is handled by api/create-order.js (Vercel serverless function).
        {
          name: 'razorpay-order-api',
          configureServer(server) {
            server.middlewares.use('/api/create-order', (req: IncomingMessage, res: ServerResponse) => {
              if (req.method !== 'POST') {
                res.writeHead(405, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Method not allowed' }));
                return;
              }

              const keyId = env.RAZORPAY_KEY_ID;
              const keySecret = env.RAZORPAY_KEY_SECRET;

              if (!keyId || !keySecret) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Payment gateway not configured' }));
                return;
              }

              let body = '';
              req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
              req.on('end', async () => {
                try {
                  const { amount, currency = 'INR', receipt } = JSON.parse(body);
                  const credentials = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
                  const response = await fetch('https://api.razorpay.com/v1/orders', {
                    method: 'POST',
                    headers: {
                      Authorization: `Basic ${credentials}`,
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ amount, currency, receipt: receipt || `receipt_${Date.now()}` }),
                  });
                  const data = await response.json() as any;
                  if (!response.ok) {
                    res.writeHead(response.status, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: data.error?.description || 'Failed to create order' }));
                    return;
                  }
                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ orderId: data.id }));
                } catch {
                  res.writeHead(500, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ error: 'Internal server error' }));
                }
              });
            });
          },
        },
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
