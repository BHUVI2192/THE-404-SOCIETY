import crypto from 'crypto';

// Server-side PhonePe Configuration
// Secrets MUST come from process.env (server only), NEVER exposed via VITE_
const PHONEPE_MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID || process.env.VITE_PHONEPE_MERCHANT_ID || '';
const PHONEPE_SALT_KEY = process.env.PHONEPE_SALT_KEY || process.env.VITE_PHONEPE_SALT_KEY || '';
const PHONEPE_SALT_INDEX = process.env.PHONEPE_SALT_INDEX || process.env.VITE_PHONEPE_SALT_INDEX || '1';
const PHONEPE_MODE = process.env.PHONEPE_MODE || 'SANDBOX';

const BASE_URL = PHONEPE_MODE === 'PRODUCTION'
  ? 'https://api.phonepe.com/apis/hermes'
  : 'https://api-preprod.phonepe.com/apis/pg-sandbox';

/**
 * Generate SHA256 checksum on server only
 */
function generateChecksum(base64Payload, endpoint) {
  const stringToHash = base64Payload + endpoint + PHONEPE_SALT_KEY;
  const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
  return `${sha256}###${PHONEPE_SALT_INDEX}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, payload, endpoint } = req.body || {};

  if (!PHONEPE_MERCHANT_ID || !PHONEPE_SALT_KEY) {
    return res.status(500).json({
      error: 'PhonePe credentials not configured on the server. Set PHONEPE_MERCHANT_ID and PHONEPE_SALT_KEY.',
    });
  }

  try {
    if (action === 'initiate') {
      const { transactionId, amount, userId, redirectUrl, callbackUrl } = payload;
      
      const paymentPayload = {
        merchantId: PHONEPE_MERCHANT_ID,
        merchantTransactionId: transactionId,
        merchantUserId: userId,
        amount: Math.round(amount),
        redirectUrl: redirectUrl || `${req.headers.origin}/#/payment-status`,
        redirectMode: 'POST',
        callbackUrl: callbackUrl || `${req.headers.origin}/api/phonepe/callback`,
        paymentInstrument: {
          type: 'PAY_PAGE',
        },
      };

      const base64Payload = Buffer.from(JSON.stringify(paymentPayload)).toString('base64');
      const apiEndpoint = '/pg/v1/pay';
      const xVerify = generateChecksum(base64Payload, apiEndpoint);

      const response = await fetch(`${BASE_URL}${apiEndpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': xVerify,
        },
        body: JSON.stringify({ request: base64Payload }),
      });

      const data = await response.json();
      return res.status(200).json(data);
    }

    if (action === 'status') {
      const { transactionId } = payload;
      const apiEndpoint = `/pg/v1/status/${PHONEPE_MERCHANT_ID}/${transactionId}`;
      const xVerify = generateChecksum('', apiEndpoint);

      const response = await fetch(`${BASE_URL}${apiEndpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': xVerify,
          'X-MERCHANT-ID': PHONEPE_MERCHANT_ID,
        },
      });

      const data = await response.json();
      return res.status(200).json(data);
    }

    return res.status(400).json({ error: `Unknown action: ${action}` });
  } catch (err) {
    console.error('PhonePe Server API Error:', err);
    return res.status(500).json({ error: err.message || 'PhonePe processing failed' });
  }
}
