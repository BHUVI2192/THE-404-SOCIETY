# Razorpay Payment Integration - Testing Guide

## 🐛 Bugs Fixed

### 1. **Razorpay 400 Bad Request Error**
**Problem**: Razorpay API was rejecting payments with 400 status code.

**Root Cause**: Using client-generated `order_id` without creating it through Razorpay Orders API (requires server-side implementation).

**Solution**: 
- Removed `order_id` parameter from Razorpay options for test mode
- Created payment record in Firestore BEFORE opening Razorpay modal
- Generated client-side reference ID for tracking

### 2. **Missing Payment Record**
**Problem**: Payment status page couldn't find payment records to update.

**Solution**: Payment record is now created in Firestore during `initiatePayment()` with status 'pending', then updated to 'success' after payment completion.

---

## 🧪 How to Test Payment Flow

### Step 1: Create a Paid Event (Admin)
1. Navigate to: `/#/admin/events`
2. Click "Create New Event"
3. Fill in event details
4. **Turn OFF "Free Event"** toggle
5. Set Registration Fee: e.g., `100` (₹100)
6. Optional: Enable Early Bird Discount (e.g., 20% off until future date)
7. Save event

### Step 2: Register for Event (User)
1. Navigate to: `/#/events`
2. Click on your paid event
3. Click "Register Now"
4. Fill in registration form (name, email, phone required)
5. Submit form
6. System automatically redirects to **Payment Page** (`/events/{id}/payment`)

### Step 3: Payment Page
Shows:
- Event details with date/location
- Your registration info
- Price breakdown (with early bird discount if applicable)
- Terms checkbox
- "Pay Now" button

### Step 4: Razorpay Test Payment
1. Click "Pay ₹100.00"
2. Razorpay modal opens
3. **Test Card Details**:
   - Card Number: `4111 1111 1111 1111`
   - Expiry: Any future date (e.g., `12/26`)
   - CVV: Any 3 digits (e.g., `123`)
   - Cardholder Name: Any name
4. Click "Pay"

### Step 5: Success Flow
- ✅ Confetti animation plays
- ✅ Shows payment confirmation with:
  - Registration ID
  - Payment ID (from Razorpay)
  - Order ID (reference)
  - Event details
  - Email confirmation notice
- ✅ "Download Receipt" button
- ✅ "Back to Events" button

### Step 6: Verify in Admin Dashboard
1. Navigate to: `/#/admin/payments`
2. Should see:
   - Revenue increased by ₹100
   - New payment in table with status "success"
   - Customer details, payment ID, order ID
3. Can export payments to CSV

---

## 🔐 Test Credentials (Already Configured)

**Environment**: `.env.local`
```env
VITE_RAZORPAY_KEY_ID=rzp_test_SPszl0IhFrWBJS
VITE_RAZORPAY_KEY_SECRET=DkRR2lKZDf71Md3DIMhAK9D0
VITE_RAZORPAY_MODE=TEST
```

**Test Cards**:
- Success: `4111 1111 1111 1111`
- Failure: `4000 0000 0000 0002`

---

## 🔄 Payment Flow Architecture

```
EventRegistration.tsx
    ↓ (if paid event)
Payment.tsx
    ↓ (user clicks Pay)
lib/razorpay.ts → initiatePayment()
    ↓
1. Create pending payment in Firestore
2. Open Razorpay modal
3. User enters card details
    ↓ (on success)
PaymentStatus.tsx (success)
    ↓
1. Update payment status to 'success'
2. Update registration with paymentId
3. Show confetti + receipt
```

---

## 📊 Database Structure

### Collection: `nexus_payments`
```typescript
{
  id: "auto-generated",
  userId: "user@email.com",
  eventId: "event_abc123",
  registrationId: "reg_xyz789",
  amount: 10000,  // in paise (₹100.00)
  currency: "INR",
  status: "pending" | "success" | "failed" | "refunded",
  razorpayOrderId: "order_1234_abc",  // our reference
  razorpayPaymentId: "pay_xyz123",    // from Razorpay
  razorpaySignature: "signature...",
  userName: "John Doe",
  userEmail: "john@example.com",
  userPhone: "+919876543210",
  paymentMethod: "card",
  createdAt: 1234567890,
  updatedAt: 1234567890
}
```

### Collection: `nexus_registrations`
```typescript
{
  id: "auto-generated",
  eventId: "event_abc123",
  eventTitle: "AI Workshop",
  name: "John Doe",
  email: "john@example.com",
  phone: "+919876543210",
  paymentStatus: "pending" | "completed" | "failed" | "not_required",
  paymentId: "pay_xyz123",
  amountPaid: 10000,  // in paise
  createdAt: 1234567890
}
```

---

## ✅ Features Implemented

- [x] Razorpay test mode integration
- [x] Payment record creation in Firestore
- [x] Early bird discount calculation
- [x] Multiple payment methods (UPI, cards, netbanking, wallets)
- [x] Payment success/failure handling
- [x] Confetti animation on success
- [x] Receipt download
- [x] Admin payment dashboard
- [x] CSV export
- [x] Payment filters (event, status, search)
- [x] Revenue analytics

---

## 🚀 Going to Production

### Required Changes:
1. **Create Razorpay Live Account**
   - Get live API keys from https://dashboard.razorpay.com
   
2. **Update Environment Variables**
   ```env
   VITE_RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY
   VITE_RAZORPAY_KEY_SECRET=your_live_secret
   VITE_RAZORPAY_MODE=LIVE
   ```

3. **Implement Server-Side Order Creation** (Recommended)
   - Use Razorpay Orders API to create order_id server-side
   - Prevents amount manipulation
   - More secure

4. **Add Webhook Handler** (Required for production)
   - Verify payments server-side
   - Handle payment failures asynchronously
   - Update database from webhook events

5. **Enable Payment Verification**
   - Implement signature verification server-side
   - Never trust client-side payment status alone

---

## 🐛 Troubleshooting

### Payment Modal Not Opening
- Check browser console for Razorpay SDK errors
- Verify SDK script is loaded in `index.html`
- Test with: `console.log(window.Razorpay)`

### 400 Bad Request Errors
- ✅ **FIXED**: Removed `order_id` requirement
- Verify API key is correct
- Check amount is in paise (multiply by 100)

### Payment Shows as Pending
- Check PaymentStatus.tsx console for errors
- Verify Firestore rules allow updates
- Check payment record exists with `getPaymentByOrderId()`

### Confetti Not Showing
- Install canvas-confetti: `npm install canvas-confetti`
- Check browser compatibility (WebGL required)

---

## 📞 Support

For Razorpay API issues:
- Docs: https://razorpay.com/docs/payments/
- Support: https://razorpay.com/support/

For code issues:
- Check browser console
- Verify Firestore indexes
- Test with sample data
