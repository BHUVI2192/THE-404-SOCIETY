/**
 * Vercel Serverless Function: Create Razorpay Order
 * POST /api/create-order
 * Body: { amount: number (paise), currency?: string, receipt?: string }
 * Returns: { orderId: string }
 *
 * The secret key is NEVER sent to the browser — it only lives in this server function.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { amount, currency = 'INR', receipt } = req.body || {};

  if (!amount || typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return res.status(500).json({ error: 'Payment gateway not configured on server' });
  }

  try {
    const credentials = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, currency, receipt: receipt || `receipt_${Date.now()}` }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.description || 'Failed to create Razorpay order',
      });
    }

    return res.status(200).json({ orderId: data.id });
  } catch (error) {
    console.error('[create-order] Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
