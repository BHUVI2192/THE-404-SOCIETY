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

              const emailUser = env.EMAIL_USER?.trim();
              const emailPass = env.EMAIL_PASS ? env.EMAIL_PASS.replace(/^["']|["']$/g, '').trim() : '';

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
