import nodemailer from 'nodemailer';

// In-memory rate limiting map: ip -> array of timestamps
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

// Cleanup old rate limit entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamps] of rateLimitMap.entries()) {
    const valid = timestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW_MS);
    if (valid.length === 0) {
      rateLimitMap.delete(ip);
    } else {
      rateLimitMap.set(ip, valid);
    }
  }
}, 10 * 60 * 1000);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 1. Origin & Referer Verification (prevent arbitrary public third-party abuse)
  const origin = req.headers['origin'] || req.headers['referer'] || '';
  const allowedHostPatterns = [
    'localhost',
    '127.0.0.1',
    'the404society.in',
    'youdecide.studio',
    'youdecide-studio',
    'vercel.app',
  ];

  if (origin) {
    const isAllowed = allowedHostPatterns.some(pattern => origin.includes(pattern));
    if (!isAllowed) {
      return res.status(403).json({ error: 'Forbidden: Request origin not allowed' });
    }
  }

  // 2. IP Rate Limiting
  const clientIp =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    'unknown-ip';

  const now = Date.now();
  const requestTimestamps = rateLimitMap.get(clientIp) || [];
  const recentRequests = requestTimestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW_MS);

  if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      error: 'Too many requests. Please wait a moment before sending another message.',
    });
  }

  recentRequests.push(now);
  rateLimitMap.set(clientIp, recentRequests);

  // 3. Payload validation
  const { to, subject, text, html } = req.body || {};

  if (!to || !subject || (!text && !html)) {
    return res.status(400).json({ error: 'Missing required fields (to, subject, text/html)' });
  }

  // Basic email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (typeof to !== 'string' || !emailRegex.test(to.trim())) {
    return res.status(400).json({ error: 'Invalid recipient email address' });
  }

  // Length caps to prevent massive payload memory DOS
  if (typeof subject !== 'string' || subject.length > 200) {
    return res.status(400).json({ error: 'Subject exceeds maximum allowed length of 200 characters' });
  }

  const content = text || html || '';
  if (typeof content !== 'string' || content.length > 30000) {
    return res.status(400).json({ error: 'Content exceeds maximum allowed length of 30,000 characters' });
  }

  const emailUser = process.env.EMAIL_USER?.trim();
  const emailPass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/^["']|["']$/g, '').trim() : '';

  if (!emailUser || !emailPass) {
    console.error('Email credentials not configured (EMAIL_USER or EMAIL_PASS missing).');
    return res.status(500).json({ error: 'Email service credentials not configured on the server.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const isStudioSender = subject.toLowerCase().includes('youdecide') || (html && html.includes('youdecide'));
    const senderName = isStudioSender ? 'YouDecide Studio' : 'The 404 Society';

    const mailOptions = {
      from: `"${senderName}" <${emailUser}>`,
      to: to.trim(),
      subject: subject.trim(),
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);

    return res.status(200).json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
}
