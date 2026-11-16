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
        // Dev-only middleware: handles /api/send-email during local development.
        {
          name: 'email-sender-api',
          configureServer(server) {
            server.middlewares.use('/api/send-email', (req: IncomingMessage, res: ServerResponse) => {
              if (req.method !== 'POST') {
                res.writeHead(405, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Method not allowed' }));
                return;
              }

              const emailUser = env.EMAIL_USER;
              const emailPass = env.EMAIL_PASS;

              if (!emailUser || !emailPass) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Email service not configured. Check .env.local for EMAIL_USER and EMAIL_PASS.' }));
                return;
              }

              let body = '';
              req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
              req.on('end', async () => {
                try {
                  const { to, subject, text, html } = JSON.parse(body);
                  
                  // Dynamically import nodemailer to avoid issues if not installed
                  const nodemailer = await import('nodemailer');
                  const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                      user: emailUser,
                      pass: emailPass,
                    },
                  });

                  await transporter.sendMail({
                    from: `"The 404 Society" <${emailUser}>`,
                    to,
                    subject,
                    text,
                    html,
                  });

                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ success: true }));
                } catch (error: any) {
                  console.error('Local Email Error:', error);
                  res.writeHead(500, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ error: error.message || 'Failed to send email locally' }));
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
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks(id) {
              if (!id.includes('node_modules')) return;

              if (id.includes('three') || id.includes('@react-three')) {
                return 'three-vendor';
              }

              if (id.includes('firebase')) {
                return 'firebase-vendor';
              }

              if (id.includes('gsap') || id.includes('framer-motion')) {
                return 'animation-vendor';
              }

              if (id.includes('react-router')) {
                return 'router-vendor';
              }

              return 'vendor';
            },
          },
        },
      }
    };
});
