# Third-Party Integration Guide

This document covers the setup, configuration, and usage of all third-party services integrated with the Kuwait Marketplace platform.

## Table of Contents

1. [Payment Providers](#payment-providers)
   - [Stripe](#stripe)
   - [PayPal](#paypal)
   - [Manual Payment](#manual-payment)
2. [SMS/Twilio Integration](#smstwilio-integration)
   - [Account Setup](#twilio-account-setup)
   - [Environment Configuration](#twilio-environment-configuration)
   - [OTP Flow](#otp-flow-implementation)
   - [Order Notifications](#order-notification-sms)
3. [File Storage](#file-storage)
   - [AWS S3](#aws-s3-configuration)
   - [Local Storage](#local-storage-fallback)
4. [Redis](#redis)
   - [Session Storage](#session-storage)
   - [Cache Configuration](#cache-configuration)
5. [Testing Integrations](#testing-integrations)
   - [Sandbox Modes](#sandboxtest-modes)
   - [Mock Configurations](#mock-configurations)

---

## Payment Providers

The Kuwait Marketplace supports multiple payment providers through Medusa's payment module. Each provider is conditionally loaded based on environment variables.

### Stripe

Stripe is the primary payment provider, offering credit/debit card processing with global coverage.

#### Prerequisites

- Stripe account (https://dashboard.stripe.com)
- API keys (test and live)
- Webhook endpoint configured

#### Environment Variables

```env
# Stripe Configuration
# Get your API keys from: https://dashboard.stripe.com/test/apikeys

# Secret Key (required)
# Use sk_test_xxx for testing, sk_live_xxx for production
STRIPE_API_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Webhook Secret (recommended for security)
# Create a webhook at: https://dashboard.stripe.com/test/webhooks
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### Setup Steps

1. **Create a Stripe Account**
   - Go to https://dashboard.stripe.com/register
   - Complete the business verification process

2. **Get API Keys**
   - Navigate to Developers > API Keys
   - Copy the Secret Key (starts with `sk_test_` or `sk_live_`)
   - Add to your `.env` file as `STRIPE_API_KEY`

3. **Configure Webhooks**
   - Navigate to Developers > Webhooks
   - Click "Add endpoint"
   - Set the endpoint URL to: `https://your-domain.com/webhooks/stripe`
   - Select events to listen for:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `payment_intent.canceled`
     - `charge.refunded`
   - Copy the Signing Secret and add as `STRIPE_WEBHOOK_SECRET`

4. **Enable in Medusa Config**

   The payment provider is automatically enabled when `STRIPE_API_KEY` is set:

   ```typescript
   // backend/medusa-config.ts
   {
     resolve: "@medusajs/medusa/payment",
     options: {
       providers: [
         ...(process.env.STRIPE_API_KEY
           ? [
               {
                 resolve: "@medusajs/medusa/payment-stripe",
                 id: "stripe",
                 options: {
                   apiKey: process.env.STRIPE_API_KEY,
                   webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
                 },
               },
             ]
           : []),
       ],
     },
   }
   ```

#### Webhook Events

| Event | Description | Medusa Action |
|-------|-------------|---------------|
| `payment_intent.succeeded` | Payment completed | Mark payment as captured |
| `payment_intent.payment_failed` | Payment failed | Mark payment as failed |
| `payment_intent.canceled` | Payment canceled | Mark payment as canceled |
| `charge.refunded` | Refund processed | Update refund status |

#### Testing with Stripe CLI

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:9000/webhooks/stripe

# Trigger test events
stripe trigger payment_intent.succeeded
```

#### Test Card Numbers

| Card Number | Scenario |
|-------------|----------|
| `4242424242424242` | Successful payment |
| `4000000000000002` | Declined card |
| `4000002500003155` | Requires 3D Secure |
| `4000000000009995` | Insufficient funds |

---

### PayPal

PayPal provides an alternative payment method popular in the Middle East region.

#### Prerequisites

- PayPal Developer account (https://developer.paypal.com)
- Sandbox and/or Production app credentials
- `@paypal/paypal-server-sdk` package installed

#### Environment Variables

```env
# PayPal Configuration
# Get credentials from: https://developer.paypal.com/dashboard/applications

# Client ID (required)
PAYPAL_CLIENT_ID=your_paypal_client_id

# Client Secret (required)
PAYPAL_CLIENT_SECRET=your_paypal_client_secret

# Environment: "sandbox" for testing, "production" for live payments
PAYPAL_ENVIRONMENT=sandbox

# Auto-capture: "true" to capture immediately, "false" to authorize first
PAYPAL_AUTO_CAPTURE=false

# Webhook ID for validating PayPal webhooks (optional, improves security)
PAYPAL_WEBHOOK_ID=your_webhook_id
```

#### Setup Steps

1. **Create a PayPal Developer Account**
   - Go to https://developer.paypal.com
   - Sign up or log in with your PayPal account

2. **Create an Application**
   - Navigate to My Apps & Credentials
   - Click "Create App" under REST API apps
   - Name your application (e.g., "Kuwait Marketplace")
   - Select account type (Sandbox for testing, Live for production)

3. **Get Credentials**
   - Copy the Client ID and Client Secret
   - Add to your `.env` file

4. **Configure Webhooks**
   - In your app settings, go to Webhooks
   - Add webhook URL: `https://your-domain.com/webhooks/paypal`
   - Subscribe to events:
     - `PAYMENT.CAPTURE.COMPLETED`
     - `PAYMENT.AUTHORIZATION.CREATED`
     - `PAYMENT.CAPTURE.REFUNDED`
     - `PAYMENT.AUTHORIZATION.VOIDED`

5. **Enable in Medusa Config**

   The provider is automatically enabled when both credentials are set:

   ```typescript
   // backend/medusa-config.ts
   {
     resolve: "@medusajs/medusa/payment",
     options: {
       providers: [
         ...(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET
           ? [
               {
                 resolve: "./src/modules/paypal",
                 id: "paypal",
                 options: {
                   client_id: process.env.PAYPAL_CLIENT_ID,
                   client_secret: process.env.PAYPAL_CLIENT_SECRET,
                   environment: process.env.PAYPAL_ENVIRONMENT || "sandbox",
                   autoCapture: process.env.PAYPAL_AUTO_CAPTURE === "true",
                   webhook_id: process.env.PAYPAL_WEBHOOK_ID,
                 },
               },
             ]
           : []),
       ],
     },
   }
   ```

#### Payment Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                      PayPal Payment Flow                         │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Customer clicks "Pay with PayPal"                            │
│           │                                                      │
│           ▼                                                      │
│  2. Backend calls initiatePayment()                              │
│     - Creates PayPal order                                       │
│     - Returns approval_url                                       │
│           │                                                      │
│           ▼                                                      │
│  3. Frontend redirects to PayPal approval_url                    │
│     - Customer logs into PayPal                                  │
│     - Approves payment                                           │
│           │                                                      │
│           ▼                                                      │
│  4. PayPal redirects back to your site                           │
│     - order_id in URL parameters                                 │
│           │                                                      │
│           ▼                                                      │
│  5. Backend calls authorizePayment()                             │
│     - If autoCapture=true: captures immediately                  │
│     - If autoCapture=false: authorizes for later capture         │
│           │                                                      │
│           ▼                                                      │
│  6. Order completed                                              │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

#### PayPal Status Mapping

| PayPal Status | Medusa Status |
|---------------|---------------|
| `CREATED` | `pending` |
| `SAVED` | `pending` |
| `APPROVED` | `authorized` |
| `VOIDED` | `canceled` |
| `COMPLETED` | `captured` |
| `PAYER_ACTION_REQUIRED` | `requires_more` |

#### Webhook Events

| Event | Description | Action |
|-------|-------------|--------|
| `PAYMENT.CAPTURE.COMPLETED` | Payment captured | Mark as captured |
| `PAYMENT.AUTHORIZATION.CREATED` | Payment authorized | Mark as authorized |
| `PAYMENT.CAPTURE.REFUNDED` | Refund processed | Update refund status |
| `PAYMENT.AUTHORIZATION.VOIDED` | Authorization voided | Mark as canceled |

#### Testing PayPal Sandbox

1. Create sandbox accounts at https://developer.paypal.com/dashboard/accounts
2. Use sandbox credentials in development
3. Log in with sandbox buyer account during checkout testing

---

### Manual Payment

Manual payment allows customers to pay through bank transfer, cash on delivery, or other offline methods.

#### Configuration

Manual payment is built into Medusa and does not require additional setup. To enable:

1. **Add to Payment Providers in Admin**
   - Go to Settings > Regions
   - Select your region
   - Add "Manual" to payment providers

2. **Workflow**
   - Customer selects manual payment at checkout
   - Order is created with "awaiting" payment status
   - Admin manually captures payment when received
   - Order status updates accordingly

---

## SMS/Twilio Integration

The platform uses Twilio for SMS-based features including OTP authentication and order notifications.

### Twilio Account Setup

1. **Create a Twilio Account**
   - Go to https://www.twilio.com/try-twilio
   - Sign up for a free account (includes trial credits)

2. **Verify Your Phone Number**
   - Required for trial accounts
   - Used to receive test messages

3. **Get a Twilio Phone Number**
   - Navigate to Console > Phone Numbers > Manage > Buy a Number
   - Select a number with SMS capability
   - Note: For Kuwait, you may need a number that supports international SMS

4. **Find Your Credentials**
   - Navigate to Console > Account Info
   - Copy Account SID and Auth Token

### Twilio Environment Configuration

```env
# Twilio SMS Configuration
# Get these from your Twilio Console: https://console.twilio.com/

# Account SID (required)
# Found on the main dashboard
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Auth Token (required)
# Found on the main dashboard (click to reveal)
TWILIO_AUTH_TOKEN=your_auth_token_here

# From Number (required)
# Your Twilio phone number or Messaging Service SID
# Format: +1234567890 or MGxxxxx (for Messaging Service)
TWILIO_FROM_NUMBER=+1234567890
```

### OTP Flow Implementation

The OTP system provides phone-based authentication for customers.

#### Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        OTP Authentication Flow                    │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Customer                    Backend                   Twilio    │
│     │                          │                         │       │
│     │  1. Enter phone number   │                         │       │
│     │ ───────────────────────► │                         │       │
│     │                          │                         │       │
│     │                          │  2. Generate OTP        │       │
│     │                          │  3. Store with expiry   │       │
│     │                          │                         │       │
│     │                          │  4. Send SMS ──────────►│       │
│     │                          │                         │       │
│     │ ◄──── 5. OTP Code (SMS)  │ ◄───────────────────── │       │
│     │                          │                         │       │
│     │  6. Submit OTP code      │                         │       │
│     │ ───────────────────────► │                         │       │
│     │                          │                         │       │
│     │                          │  7. Verify OTP          │       │
│     │                          │  8. Create/Get Customer │       │
│     │                          │                         │       │
│     │ ◄── 9. Auth success      │                         │       │
│     │                          │                         │       │
└──────────────────────────────────────────────────────────────────┘
```

#### API Endpoints

**Send OTP**

```http
POST /store/auth/otp/send
Content-Type: application/json

{
  "phone": "+96512345678"
}
```

**Response (Success)**
```json
{
  "success": true,
  "message": "OTP sent successfully. Please check your phone."
}
```

**Response (Error)**
```json
{
  "type": "rate_limit",
  "message": "Too many OTP requests. Please try again later."
}
```

**Verify OTP**

```http
POST /store/auth/otp/verify
Content-Type: application/json

{
  "phone": "+96512345678",
  "code": "123456"
}
```

**Response (Success)**
```json
{
  "verified": true,
  "message": "Phone number verified successfully",
  "customer": {
    "id": "cus_xxxxx",
    "email": "phone_96512345678@placeholder.local",
    "phone": "+96512345678",
    "first_name": "",
    "last_name": "",
    "has_account": true,
    "is_new": true
  }
}
```

#### OTP Configuration

The OTP service is configured in `backend/src/services/otp-instance.ts`:

```typescript
export const OTP_CONFIG = {
  otpLength: 6,              // 6-digit codes
  otpExpirySeconds: 300,     // 5 minutes expiry
  maxAttempts: 3,            // Max verification attempts
  maxRequestsPerHour: 5,     // Rate limit per phone number
}
```

#### OTP Service Features

| Feature | Description |
|---------|-------------|
| Code Generation | Secure random 6-digit numeric codes |
| Rate Limiting | 5 requests per hour per phone number |
| Attempt Limiting | 3 verification attempts per code |
| Expiration | Codes expire after 5 minutes |
| Phone Normalization | E.164 format normalization |
| Development Mode | Logs OTP to console if Twilio not configured |

#### Development Mode

When Twilio credentials are not configured, the OTP service runs in development mode:

```
[OTP] SMS service not configured. Development mode enabled.
[OTP] Would send to +96512345678: Your verification code is: 123456. This code expires in 5 minutes. Do not share this code with anyone.
```

This allows testing the OTP flow without Twilio costs.

### Order Notification SMS

The platform sends SMS notifications for order events.

#### SMS Service Usage

```typescript
import { SMSNotificationService } from '../services/sms-notification'

const smsService = new SMSNotificationService()

// Check if service is configured
if (smsService.isReady()) {
  // Send order confirmation
  await smsService.sendOrderPlacedSMS({
    orderId: 'order_xxx',
    orderNumber: 'KW-2024-001',
    customerPhone: '+96512345678',
    customerName: 'Ahmed',
    totalAmount: '25.500',
    currency: 'KWD',
    itemCount: 3,
  })

  // Send shipping update
  await smsService.sendShippingUpdateSMS({
    orderId: 'order_xxx',
    orderNumber: 'KW-2024-001',
    customerPhone: '+96512345678',
    trackingNumber: 'TRACK123456',
    carrier: 'Aramex',
    status: 'shipped',
  })
}
```

#### SMS Message Templates

**Order Placed**
```
Hi Ahmed, Your order #KW-2024-001 has been placed! Total: KWD 25.500 (3 items). We'll notify you when it ships. Thank you for shopping with us!
```

**Shipped**
```
Your order #KW-2024-001 has shipped! Track it with Aramex: TRACK123456
```

**Out for Delivery**
```
Your order #KW-2024-001 is out for delivery today!
```

**Delivered**
```
Your order #KW-2024-001 has been delivered. Thank you for your purchase!
```

---

## File Storage

### AWS S3 Configuration

For production deployments, configure AWS S3 for scalable file storage.

#### Environment Variables

```env
# AWS S3 File Storage
# Get credentials from AWS IAM Console

# S3 bucket URL (required)
S3_FILE_URL=https://your-bucket.s3.us-east-1.amazonaws.com

# IAM Access Key (required)
S3_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE

# IAM Secret Key (required)
S3_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

# AWS Region (required)
S3_REGION=us-east-1

# S3 Bucket Name (required)
S3_BUCKET=kuwait-marketplace-uploads

# Path prefix for uploads (optional)
S3_PREFIX=uploads
```

#### S3 Bucket Setup

1. **Create an S3 Bucket**
   ```bash
   aws s3 mb s3://kuwait-marketplace-uploads --region us-east-1
   ```

2. **Configure Bucket Policy for Public Read**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::kuwait-marketplace-uploads/*"
       }
     ]
   }
   ```

3. **Configure CORS**
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "PUT", "POST"],
       "AllowedOrigins": ["https://your-storefront.com"],
       "ExposeHeaders": []
     }
   ]
   ```

4. **Create IAM User**
   - Create a new IAM user with programmatic access
   - Attach policy with S3 permissions:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "s3:PutObject",
           "s3:GetObject",
           "s3:DeleteObject",
           "s3:ListBucket"
         ],
         "Resource": [
           "arn:aws:s3:::kuwait-marketplace-uploads",
           "arn:aws:s3:::kuwait-marketplace-uploads/*"
         ]
       }
     ]
   }
   ```

### Local Storage Fallback

When S3 is not configured, Medusa uses local file storage. Files are stored in the `uploads/` directory.

#### Considerations

| Aspect | Local Storage | S3 Storage |
|--------|---------------|------------|
| Persistence | Lost on redeploy | Permanent |
| Scalability | Limited | Unlimited |
| CDN | Manual setup | Built-in |
| Cost | Free | Pay per use |
| Multi-instance | Not supported | Supported |

**Recommendation**: Use S3 for production deployments.

---

## Redis

Redis is used for caching, session storage, and background job management.

### Session Storage

Redis stores user sessions for authentication persistence.

#### Environment Variables

```env
# Redis Configuration
# Local: redis://localhost:6379
# Cloud: redis://user:password@host:port

REDIS_URL=redis://localhost:6379
```

#### Redis Modules in Medusa

Enable Redis modules in `medusa-config.ts` for production:

```typescript
modules: [
  // Cache with Redis
  {
    resolve: "@medusajs/medusa/cache-redis",
    options: {
      redisUrl: process.env.REDIS_URL
    }
  },

  // Event bus with Redis (for background jobs)
  {
    resolve: "@medusajs/medusa/event-bus-redis",
    options: {
      redisUrl: process.env.REDIS_URL
    }
  },

  // Workflow engine with Redis
  {
    resolve: "@medusajs/medusa/workflow-engine-redis",
    options: {
      redis: {
        url: process.env.REDIS_URL
      }
    }
  },

  // Distributed locking with Redis
  {
    resolve: "@medusajs/medusa/locking-redis",
    options: {
      redisUrl: process.env.REDIS_URL
    }
  }
]
```

### Cache Configuration

#### Redis Cache Benefits

- **Session Management**: Persistent sessions across restarts
- **API Response Caching**: Faster response times
- **Rate Limiting**: Distributed rate limiting
- **Background Jobs**: Reliable job queue

#### Setting Up Redis

**Local Development (Docker)**
```bash
docker run -d -p 6379:6379 --name redis redis:alpine
```

**Local Development (Homebrew)**
```bash
brew install redis
brew services start redis
```

**Production (Redis Cloud)**
1. Create account at https://redis.com/try-free/
2. Create a database
3. Copy the connection URL
4. Add to environment variables

#### Verifying Redis Connection

```bash
# Test connection
redis-cli ping
# Expected: PONG

# Check info
redis-cli info
```

---

## Testing Integrations

### Sandbox/Test Modes

Each integration supports testing without affecting production data.

#### Stripe Test Mode

```env
# Use test keys (sk_test_xxx)
STRIPE_API_KEY=sk_test_xxxxx
```

- All transactions are simulated
- Use test card numbers
- Access test dashboard at https://dashboard.stripe.com/test

#### PayPal Sandbox

```env
# Set environment to sandbox
PAYPAL_ENVIRONMENT=sandbox
```

- Use sandbox credentials
- Create sandbox buyer/seller accounts
- No real money involved

#### Twilio Test Mode

For development without Twilio:
1. Do not set Twilio environment variables
2. OTPs will be logged to console
3. No SMS charges incurred

### Mock Configurations

#### OTP Service Mock (for Testing)

```typescript
import { OTPService, InMemoryOTPStore } from '../services/otp'

// Create mock SMS sender that always succeeds
const mockSmsSender = async (phone: string, message: string) => {
  console.log(`[MOCK SMS] To: ${phone}, Message: ${message}`)
  return true
}

// Create OTP service with mock
const otpService = new OTPService({
  store: new InMemoryOTPStore(),
  smsSender: mockSmsSender,
  otpLength: 6,
  otpExpirySeconds: 300,
  maxAttempts: 3,
  maxRequestsPerHour: 5,
})
```

#### SMS Service Mock

```typescript
import { SMSNotificationService } from '../services/sms-notification'

// Without config, service runs in mock mode
const smsService = new SMSNotificationService()

// Check status
console.log(smsService.isReady()) // false in mock mode

// Calls will return graceful failure
const result = await smsService.sendSMS({
  to: '+96512345678',
  message: 'Test message',
})
// { success: false, error: 'SMS service is not configured...' }
```

#### Payment Provider Testing

**Stripe CLI for Local Testing**
```bash
# Forward webhooks
stripe listen --forward-to localhost:9000/webhooks/stripe --skip-verify

# Trigger events
stripe trigger payment_intent.succeeded
stripe trigger payment_intent.payment_failed
```

**PayPal Sandbox Testing**
1. Log into PayPal Developer Dashboard
2. Go to Sandbox > Accounts
3. Create buyer and seller test accounts
4. Use buyer credentials during checkout

### Test Environment Checklist

| Service | Test Configuration | Verification |
|---------|-------------------|--------------|
| Stripe | `sk_test_xxx` | Test payment with 4242... card |
| PayPal | `PAYPAL_ENVIRONMENT=sandbox` | Complete sandbox checkout |
| Twilio | No credentials set | Check console for OTP logs |
| Redis | `redis://localhost:6379` | `redis-cli ping` returns PONG |
| S3 | Not configured | Files stored in `uploads/` |

### Integration Test Suite

Run the test suite to verify integrations:

```bash
# Run all tests
npm test

# Run OTP tests specifically
npm test -- --grep "OTP"

# Watch mode for development
npm run test:watch
```

---

## Troubleshooting

### Common Issues

#### Stripe Webhook Not Receiving Events

1. Check webhook URL is accessible
2. Verify webhook secret is correct
3. Use Stripe CLI to test locally
4. Check Medusa logs for errors

#### PayPal Payment Failing

1. Verify credentials are correct
2. Check environment setting (sandbox vs production)
3. Ensure currency is supported
4. Check PayPal Developer Console for errors

#### SMS Not Sending

1. Verify Twilio credentials
2. Check phone number format (E.164)
3. Ensure sender number can send to destination country
4. Check Twilio console for delivery status

#### Redis Connection Failed

1. Verify Redis is running: `redis-cli ping`
2. Check connection URL format
3. Verify firewall/network settings
4. Check Redis server logs

### Debug Logging

Enable debug logging for troubleshooting:

```env
# Enable database query logging
DATABASE_LOGGING=true

# Node environment
NODE_ENV=development
```

### Support Resources

| Service | Documentation | Support |
|---------|---------------|---------|
| Stripe | https://stripe.com/docs | https://support.stripe.com |
| PayPal | https://developer.paypal.com/docs | https://developer.paypal.com/support |
| Twilio | https://www.twilio.com/docs | https://support.twilio.com |
| Redis | https://redis.io/docs | https://redis.io/community |
| AWS S3 | https://docs.aws.amazon.com/s3 | https://aws.amazon.com/support |
| Medusa | https://docs.medusajs.com | https://discord.gg/medusajs |

---

## Security Best Practices

### API Keys and Secrets

1. **Never commit secrets** to version control
2. **Use environment variables** for all credentials
3. **Rotate keys regularly** (at least quarterly)
4. **Use different keys** for development and production
5. **Limit key permissions** to minimum required

### Webhook Security

1. **Verify webhook signatures** (implemented for Stripe/PayPal)
2. **Use HTTPS** for all webhook endpoints
3. **Implement idempotency** for webhook handlers
4. **Log all webhook events** for debugging

### SMS Security

1. **Rate limit OTP requests** (configured: 5/hour)
2. **Limit verification attempts** (configured: 3/OTP)
3. **Short expiry times** (configured: 5 minutes)
4. **Never log OTP codes** in production
5. **Monitor for suspicious patterns**

### Data Protection

1. **Encrypt sensitive data** at rest and in transit
2. **Use secure connections** (TLS/SSL)
3. **Implement proper access controls**
4. **Regular security audits**
5. **GDPR/data privacy compliance**
