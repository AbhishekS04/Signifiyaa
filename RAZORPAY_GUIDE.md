# Razorpay Production Setup Guide for Expo

This guide explains how to switch your Razorpay integration from **Test Mode** to **Live Mode** (Real Money).

## 1. Generate Live Keys

1. Log in to your [Razorpay Dashboard](https://dashboard.razorpay.com/).
2. In the sidebar, switch the mode toggle from **Test** to **Live**.
    > **Note**: You must have your KYB/KYC verified by Razorpay to activate Live mode.
3. Go to **Settings** -> **API Keys**.
4. Click **Generate Live Key**.
5. Copy the `Key ID` (starts with `rzp_live_...`) and `Key Secret`.

## 2. Update Environment Variables

You strictly need to update the Key ID in your application.

### Local Development (`.env` / `.env.local`)

Open your `.env.local` file and replace the test key:

```env
# OLD (Test)
EXPO_PUBLIC_RAZORPAY_KEY_ID=rzp_test_S8rSjrgYttq3i7

# NEW (Live)
EXPO_PUBLIC_RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXXXXXXXX
```

### EAS Build (Production)

If you are using EAS Build, you must add the secret to your project:

```bash
eas secret:create --scope project --name EXPO_PUBLIC_RAZORPAY_KEY_ID --value rzp_live_XXXXXXXXXXXXXXXX
```

Or update it on the [Expo Dashboard](https://expo.dev) under **Project Settings -> Secrets**.

## 3. Code Verification

Ensure your code is using the environment variable and not a hardcoded string.
File: `src/screens/EventRegistrationScreen.tsx`

```typescript
// ✅ CORRECT
const RAZORPAY_KEY_ID = process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID;

// ❌ INCORRECT (Do not hardcode test keys)
const RAZORPAY_KEY_ID = 'rzp_test_S8rSjrgYttq3i7';
```

## 4. Testing

1. Create a **Production Build** (`eas build --profile production`) or run locally with the live key.
2. Initiate a payment of **₹1** (Razorpay allows small amounts for testing live flows).
3. Complete the payment using a real card/UPI.
4. Verify the transaction appears in the **Live** section of your Razorpay Dashboard.
5. Refund the ₹1 to yourself via the Dashboard if needed.
