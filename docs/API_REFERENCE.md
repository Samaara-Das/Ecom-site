# Kuwait Marketplace API Reference

**Version**: 1.0
**Date**: 2026-01-30
**Base URL**: `https://api.yourdomain.com` (Production) | `http://localhost:9000` (Development)

---

## Table of Contents

1. [Overview](#1-overview)
2. [Authentication](#2-authentication)
3. [Store API Endpoints](#3-store-api-endpoints)
   - [Products](#31-products)
   - [Carts](#32-carts)
   - [Checkout](#33-checkout)
   - [Customers](#34-customers)
   - [OTP Authentication](#35-otp-authentication)
   - [Vendors (Public)](#36-vendors-public)
   - [Vendor Portal](#37-vendor-portal)
4. [Admin API Endpoints](#4-admin-api-endpoints)
   - [Vendor Management](#41-vendor-management)
5. [Webhooks](#5-webhooks)
6. [Error Codes](#6-error-codes)
7. [Rate Limiting](#7-rate-limiting)

---

## 1. Overview

### API Architecture

The Kuwait Marketplace API is built on **Medusa v2**, providing a RESTful interface for e-commerce operations. The API is divided into two main sections:

| API Section | Base Path | Purpose |
|-------------|-----------|---------|
| **Store API** | `/store/*` | Public and customer-facing endpoints |
| **Admin API** | `/admin/*` | Administrative operations (requires auth) |

### Base URLs

| Environment | URL |
|-------------|-----|
| Production | `https://api.yourdomain.com` |
| Development | `http://localhost:9000` |

### Request Format

All requests should include:

```http
Content-Type: application/json
Accept: application/json
```

For authenticated requests, include:

```http
Authorization: Bearer <jwt_token>
```

Or use the publishable API key for storefront operations:

```http
x-publishable-api-key: <your_publishable_key>
```

### Response Format

All responses follow a consistent JSON structure:

**Success Response**:
```json
{
  "data": { ... },
  "count": 10,
  "offset": 0,
  "limit": 20
}
```

**Error Response**:
```json
{
  "type": "error_type",
  "message": "Human-readable error message",
  "errors": [
    {
      "field": "field_name",
      "message": "Field-specific error"
    }
  ]
}
```

---

## 2. Authentication

### 2.1 Authentication Methods

Kuwait Marketplace supports multiple authentication methods:

| Method | Use Case | Endpoint |
|--------|----------|----------|
| Email/Password | Traditional login | `/auth/customer/emailpass/*` |
| Phone OTP | Mobile-first authentication | `/store/auth/otp/*` |
| JWT Token | Session management | Bearer token in headers |

### 2.2 Publishable API Key

For storefront operations that don't require user authentication:

```http
x-publishable-api-key: pk_live_xxxxxxxxxxxxxxxxxxxxx
```

Obtain your publishable key from the Medusa Admin Panel under Settings > API Keys.

### 2.3 Email/Password Authentication

#### Register

```http
POST /auth/customer/emailpass/register
```

**Request Body**:
```json
{
  "email": "customer@example.com",
  "password": "SecurePassword123!"
}
```

**Response** (201 Created):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login

```http
POST /auth/customer/emailpass
```

**Request Body**:
```json
{
  "email": "customer@example.com",
  "password": "SecurePassword123!"
}
```

**Response** (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2.4 OTP Authentication Flow

See [Section 3.5 - OTP Authentication](#35-otp-authentication) for detailed OTP endpoints.

**Flow Summary**:
1. Send OTP to phone: `POST /store/auth/otp/send`
2. Verify OTP and get token: `POST /store/auth/otp/verify`
3. Use token for authenticated requests

### 2.5 Admin Authentication

```http
POST /auth/user/emailpass
```

**Request Body**:
```json
{
  "email": "admin@marketplace.com",
  "password": "AdminPassword123!"
}
```

**Response** (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 3. Store API Endpoints

### 3.1 Products

#### List Products

Retrieve a paginated list of products.

```http
GET /store/products
```

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | integer | 20 | Number of products to return |
| `offset` | integer | 0 | Number of products to skip |
| `q` | string | - | Search query |
| `category_id` | string | - | Filter by category |
| `collection_id` | string | - | Filter by collection |
| `region_id` | string | - | Filter by region (for pricing) |
| `currency_code` | string | - | Currency for prices |

**Response** (200 OK):
```json
{
  "products": [
    {
      "id": "prod_01HXYZ123456789",
      "title": "Premium Kuwaiti Saffron",
      "subtitle": "Grade A Persian Saffron",
      "description": "Authentic saffron imported from Iran...",
      "handle": "premium-kuwaiti-saffron",
      "status": "published",
      "thumbnail": "https://cdn.example.com/saffron-thumb.jpg",
      "images": [
        {
          "id": "img_01HX...",
          "url": "https://cdn.example.com/saffron-1.jpg"
        }
      ],
      "categories": [
        {
          "id": "cat_01HX...",
          "name": "Spices",
          "handle": "spices"
        }
      ],
      "variants": [
        {
          "id": "variant_01HX...",
          "title": "5g Pack",
          "sku": "SAF-5G",
          "inventory_quantity": 100,
          "prices": [
            {
              "currency_code": "kwd",
              "amount": 15000
            },
            {
              "currency_code": "usd",
              "amount": 4999
            }
          ]
        }
      ],
      "metadata": {
        "vendor_id": "vendor_01HX...",
        "vendor_name": "Al-Saffron Trading"
      },
      "created_at": "2026-01-15T10:30:00.000Z",
      "updated_at": "2026-01-28T14:22:00.000Z"
    }
  ],
  "count": 156,
  "offset": 0,
  "limit": 20
}
```

**Note**: Prices are in the smallest currency unit (e.g., 15000 = 15.000 KWD, 4999 = $49.99 USD).

#### Get Product by ID

```http
GET /store/products/:id
```

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Product ID |

**Response** (200 OK):
```json
{
  "product": {
    "id": "prod_01HXYZ123456789",
    "title": "Premium Kuwaiti Saffron",
    "subtitle": "Grade A Persian Saffron",
    "description": "Authentic saffron imported from Iran, perfect for traditional Kuwaiti dishes...",
    "handle": "premium-kuwaiti-saffron",
    "status": "published",
    "thumbnail": "https://cdn.example.com/saffron-thumb.jpg",
    "images": [...],
    "categories": [...],
    "variants": [...],
    "options": [
      {
        "id": "opt_01HX...",
        "title": "Size",
        "values": ["5g", "10g", "25g"]
      }
    ],
    "metadata": {
      "vendor_id": "vendor_01HX...",
      "vendor_name": "Al-Saffron Trading"
    },
    "created_at": "2026-01-15T10:30:00.000Z",
    "updated_at": "2026-01-28T14:22:00.000Z"
  }
}
```

---

### 3.2 Carts

#### Create Cart

```http
POST /store/carts
```

**Request Body**:
```json
{
  "region_id": "reg_01HXYZ...",
  "country_code": "kw",
  "context": {
    "ip": "88.200.xxx.xxx",
    "user_agent": "Mozilla/5.0..."
  }
}
```

**Response** (201 Created):
```json
{
  "cart": {
    "id": "cart_01HXYZ123456789",
    "region_id": "reg_01HXYZ...",
    "currency_code": "kwd",
    "items": [],
    "subtotal": 0,
    "shipping_total": 0,
    "tax_total": 0,
    "discount_total": 0,
    "total": 0,
    "created_at": "2026-01-30T08:00:00.000Z"
  }
}
```

#### Get Cart

```http
GET /store/carts/:id
```

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Cart ID |

**Response** (200 OK):
```json
{
  "cart": {
    "id": "cart_01HXYZ123456789",
    "region_id": "reg_01HXYZ...",
    "currency_code": "kwd",
    "email": "customer@example.com",
    "items": [
      {
        "id": "item_01HX...",
        "title": "Premium Kuwaiti Saffron",
        "description": "5g Pack",
        "quantity": 2,
        "unit_price": 15000,
        "total": 30000,
        "thumbnail": "https://cdn.example.com/saffron-thumb.jpg",
        "variant_id": "variant_01HX...",
        "product_id": "prod_01HX..."
      }
    ],
    "shipping_address": null,
    "billing_address": null,
    "subtotal": 30000,
    "shipping_total": 0,
    "tax_total": 1500,
    "discount_total": 0,
    "total": 31500,
    "created_at": "2026-01-30T08:00:00.000Z",
    "updated_at": "2026-01-30T08:15:00.000Z"
  }
}
```

#### Add Line Item to Cart

```http
POST /store/carts/:id/line-items
```

**Request Body**:
```json
{
  "variant_id": "variant_01HXYZ...",
  "quantity": 2,
  "metadata": {
    "vendor_id": "vendor_01HX..."
  }
}
```

**Response** (200 OK):
```json
{
  "cart": {
    "id": "cart_01HXYZ123456789",
    "items": [
      {
        "id": "item_01HX...",
        "variant_id": "variant_01HXYZ...",
        "quantity": 2,
        "unit_price": 15000,
        "total": 30000
      }
    ],
    "subtotal": 30000,
    "total": 31500
  }
}
```

#### Update Line Item

```http
POST /store/carts/:id/line-items/:line_id
```

**Request Body**:
```json
{
  "quantity": 3
}
```

#### Delete Line Item

```http
DELETE /store/carts/:id/line-items/:line_id
```

**Response** (200 OK):
```json
{
  "id": "item_01HX...",
  "deleted": true
}
```

#### Get Cart Grouped by Vendor

Returns cart items grouped by vendor for multi-vendor display.

```http
GET /store/carts/:id/grouped
```

**Response** (200 OK):
```json
{
  "cart_id": "cart_01HXYZ123456789",
  "vendor_groups": [
    {
      "vendor_id": "vendor_01HX...",
      "vendor_name": "Al-Saffron Trading",
      "vendor_logo": "https://cdn.example.com/vendor-logo.png",
      "items": [
        {
          "id": "item_01HX...",
          "title": "Premium Kuwaiti Saffron",
          "variant_title": "5g Pack",
          "quantity": 2,
          "unit_price": 15000,
          "total": 30000,
          "thumbnail": "https://cdn.example.com/saffron-thumb.jpg",
          "product_id": "prod_01HX..."
        }
      ],
      "subtotal": 30000,
      "item_count": 2
    },
    {
      "vendor_id": "vendor_02HX...",
      "vendor_name": "Kuwait Dates Co.",
      "vendor_logo": null,
      "items": [
        {
          "id": "item_02HX...",
          "title": "Medjool Dates",
          "variant_title": "1kg Box",
          "quantity": 1,
          "unit_price": 8500,
          "total": 8500,
          "thumbnail": "https://cdn.example.com/dates-thumb.jpg",
          "product_id": "prod_02HX..."
        }
      ],
      "subtotal": 8500,
      "item_count": 1
    }
  ],
  "total_items": 3,
  "subtotal": 38500
}
```

#### Update Shipping Address

```http
POST /store/carts/:id
```

**Request Body**:
```json
{
  "shipping_address": {
    "first_name": "Ahmed",
    "last_name": "Al-Sabah",
    "address_1": "Block 5, Street 10, House 25",
    "address_2": "Salmiya",
    "city": "Hawalli",
    "province": "Hawalli Governorate",
    "postal_code": "22000",
    "country_code": "kw",
    "phone": "+96512345678"
  }
}
```

---

### 3.3 Checkout

#### Add Shipping Method

```http
POST /store/carts/:id/shipping-methods
```

**Request Body**:
```json
{
  "option_id": "so_01HXYZ..."
}
```

#### Initialize Payment Session

```http
POST /store/carts/:id/payment-sessions
```

**Request Body**:
```json
{
  "provider_id": "stripe"
}
```

**Supported Providers**:
- `stripe` - Credit/Debit cards
- `paypal` - PayPal checkout
- `manual` - Cash on delivery / Bank transfer

**Response** (200 OK):
```json
{
  "cart": {
    "id": "cart_01HXYZ123456789",
    "payment_session": {
      "id": "ps_01HX...",
      "provider_id": "stripe",
      "status": "pending",
      "data": {
        "client_secret": "pi_xxx_secret_xxx"
      }
    }
  }
}
```

#### Complete Checkout

```http
POST /store/carts/:id/complete
```

**Response** (200 OK):
```json
{
  "type": "order",
  "data": {
    "id": "order_01HXYZ123456789",
    "display_id": 1042,
    "status": "pending",
    "fulfillment_status": "not_fulfilled",
    "payment_status": "captured",
    "currency_code": "kwd",
    "email": "customer@example.com",
    "items": [...],
    "shipping_address": {...},
    "billing_address": {...},
    "subtotal": 38500,
    "shipping_total": 2000,
    "tax_total": 2025,
    "discount_total": 0,
    "total": 42525,
    "created_at": "2026-01-30T09:30:00.000Z"
  }
}
```

---

### 3.4 Customers

#### Register Customer

Requires a registration token from `/auth/customer/emailpass/register`.

```http
POST /store/customers
```

**Headers**:
```http
Authorization: Bearer <registration_token>
```

**Request Body**:
```json
{
  "email": "customer@example.com",
  "first_name": "Ahmed",
  "last_name": "Al-Sabah",
  "phone": "+96512345678",
  "metadata": {
    "preferred_language": "ar"
  }
}
```

**Response** (201 Created):
```json
{
  "customer": {
    "id": "cus_01HXYZ123456789",
    "email": "customer@example.com",
    "first_name": "Ahmed",
    "last_name": "Al-Sabah",
    "phone": "+96512345678",
    "has_account": true,
    "created_at": "2026-01-30T10:00:00.000Z"
  }
}
```

**Error Responses**:

| Status | Type | Message |
|--------|------|---------|
| 400 | `invalid_data` | Validation failed |
| 401 | `unauthorized` | Registration token required |
| 409 | `conflict` | Customer with this email already exists |

#### Get Current Customer Profile

```http
GET /store/customers/me
```

**Headers**:
```http
Authorization: Bearer <jwt_token>
```

**Response** (200 OK):
```json
{
  "customer": {
    "id": "cus_01HXYZ123456789",
    "email": "customer@example.com",
    "first_name": "Ahmed",
    "last_name": "Al-Sabah",
    "phone": "+96512345678",
    "has_account": true,
    "metadata": {
      "preferred_language": "ar"
    },
    "addresses": [
      {
        "id": "addr_01HX...",
        "first_name": "Ahmed",
        "last_name": "Al-Sabah",
        "address_1": "Block 5, Street 10, House 25",
        "city": "Hawalli",
        "country_code": "kw",
        "is_default_shipping": true,
        "is_default_billing": false
      }
    ],
    "created_at": "2026-01-30T10:00:00.000Z",
    "updated_at": "2026-01-30T10:15:00.000Z"
  }
}
```

#### Update Customer Profile

```http
POST /store/customers/me
```

**Headers**:
```http
Authorization: Bearer <jwt_token>
```

**Request Body**:
```json
{
  "first_name": "Ahmed",
  "last_name": "Al-Sabah",
  "phone": "+96512345679",
  "metadata": {
    "preferred_language": "en"
  }
}
```

**Response** (200 OK):
```json
{
  "customer": {
    "id": "cus_01HXYZ123456789",
    "email": "customer@example.com",
    "first_name": "Ahmed",
    "last_name": "Al-Sabah",
    "phone": "+96512345679",
    "has_account": true,
    "metadata": {
      "preferred_language": "en"
    },
    "addresses": [...],
    "created_at": "2026-01-30T10:00:00.000Z",
    "updated_at": "2026-01-30T11:00:00.000Z"
  }
}
```

---

### 3.5 OTP Authentication

Phone-based OTP authentication for mobile-first users.

#### Send OTP

```http
POST /store/auth/otp/send
```

**Request Body**:
```json
{
  "phone": "+96512345678"
}
```

**Phone Number Format**:
- E.164 format recommended: `+96512345678`
- Also accepts: `96512345678`, `00965-1234-5678`, `12345678`
- Minimum 8 digits, maximum 20 characters

**Response** (200 OK):
```json
{
  "success": true,
  "message": "OTP sent successfully. Please check your phone."
}
```

**Error Responses**:

| Status | Type | Message |
|--------|------|---------|
| 400 | `invalid_data` | Invalid phone number format |
| 429 | `rate_limit` | Too many OTP requests. Please try again later. |
| 500 | `unexpected_error` | Failed to send OTP |

**Validation Errors** (400):
```json
{
  "type": "invalid_data",
  "message": "Validation failed",
  "errors": [
    {
      "field": "phone",
      "message": "Phone number must be at least 8 digits"
    }
  ]
}
```

#### Verify OTP

```http
POST /store/auth/otp/verify
```

**Request Body**:
```json
{
  "phone": "+96512345678",
  "code": "123456"
}
```

**Response** (200 OK):
```json
{
  "verified": true,
  "message": "Phone number verified successfully",
  "customer": {
    "id": "cus_01HXYZ123456789",
    "email": "phone_96512345678@placeholder.local",
    "phone": "+96512345678",
    "first_name": "",
    "last_name": "",
    "has_account": true,
    "created_at": "2026-01-30T10:00:00.000Z",
    "is_new": true
  }
}
```

**Notes**:
- `is_new: true` indicates a new customer was created
- `is_new: false` indicates an existing customer was authenticated
- For new customers, a placeholder email is generated

**Error Responses**:

| Status | Type | Message |
|--------|------|---------|
| 400 | `invalid_data` | Validation failed |
| 400 | `invalid_otp` | Invalid OTP code |
| 400 | `otp_not_found` | No OTP found for this phone number |
| 410 | `otp_expired` | OTP has expired. Please request a new one. |
| 429 | `max_attempts` | Maximum verification attempts exceeded |
| 500 | `unexpected_error` | Failed to verify OTP |

---

### 3.6 Vendors (Public)

Public endpoints for viewing vendor information.

#### List Active Vendors

```http
GET /store/vendors
```

Returns only verified and premium vendors.

**Response** (200 OK):
```json
{
  "vendors": [
    {
      "id": "vendor_01HXYZ123456789",
      "name": "Al-Saffron Trading",
      "description": "Premium spices and herbs from around the world",
      "logo_url": "https://cdn.example.com/vendor-logo.png",
      "status": "verified"
    },
    {
      "id": "vendor_02HXYZ...",
      "name": "Kuwait Dates Co.",
      "description": "Fresh dates directly from Kuwaiti farms",
      "logo_url": null,
      "status": "premium"
    }
  ],
  "count": 2
}
```

#### Get Vendor by ID

```http
GET /store/vendors/:id
```

Returns vendor details only for verified/premium vendors.

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Vendor ID |

**Response** (200 OK):
```json
{
  "vendor": {
    "id": "vendor_01HXYZ123456789",
    "name": "Al-Saffron Trading",
    "description": "Premium spices and herbs from around the world",
    "logo_url": "https://cdn.example.com/vendor-logo.png",
    "status": "verified",
    "city": "Kuwait City",
    "country_code": "kw"
  }
}
```

**Error Response** (404):
```json
{
  "message": "Vendor not found"
}
```

#### Apply as Vendor

```http
POST /store/vendors/apply
```

**Request Body**:
```json
{
  "name": "My Shop",
  "email": "vendor@myshop.com",
  "phone": "+96512345678",
  "description": "Quality products from Kuwait",
  "business_registration": "CR-12345",
  "address_line_1": "Block 3, Shop 15",
  "city": "Salmiya",
  "postal_code": "22000"
}
```

**Required Fields**:
- `name` - Business name
- `email` - Contact email

**Optional Fields**:
- `phone` - Contact phone
- `description` - Business description
- `business_registration` - Business registration number
- `address_line_1`, `city`, `postal_code` - Business address

**Response** (201 Created):
```json
{
  "message": "Vendor application submitted successfully",
  "vendor": {
    "id": "vendor_01HXYZ123456789",
    "name": "My Shop",
    "email": "vendor@myshop.com",
    "status": "pending"
  }
}
```

**Error Responses**:

| Status | Type | Message |
|--------|------|---------|
| 400 | - | Name and email are required |
| 409 | - | A vendor with this email already exists |

#### Check Application Status

```http
GET /store/vendors/apply?email=vendor@myshop.com
```

**Query Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | string | Yes | Vendor email |

**Response** (200 OK):
```json
{
  "vendor": {
    "id": "vendor_01HXYZ123456789",
    "name": "My Shop",
    "email": "vendor@myshop.com",
    "status": "pending",
    "created_at": "2026-01-30T10:00:00.000Z"
  }
}
```

---

### 3.7 Vendor Portal

Authenticated endpoints for vendor operations. All endpoints require vendor authentication via email query parameter.

#### Get Vendor Profile

```http
GET /store/vendors/me?email=vendor@myshop.com
```

**Query Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | string | Yes | Vendor email |

**Response** (200 OK):
```json
{
  "vendor": {
    "id": "vendor_01HXYZ123456789",
    "name": "My Shop",
    "description": "Quality products from Kuwait",
    "email": "vendor@myshop.com",
    "phone": "+96512345678",
    "logo_url": "https://cdn.example.com/my-shop-logo.png",
    "status": "verified",
    "commission_rate": 0.15,
    "business_registration": "CR-12345",
    "address_line_1": "Block 3, Shop 15",
    "address_line_2": null,
    "city": "Salmiya",
    "postal_code": "22000",
    "country_code": "kw",
    "created_at": "2026-01-15T10:00:00.000Z",
    "updated_at": "2026-01-28T14:00:00.000Z"
  }
}
```

#### Update Vendor Profile

```http
PATCH /store/vendors/me?email=vendor@myshop.com
```

**Request Body**:
```json
{
  "name": "My Updated Shop",
  "description": "Premium quality products from Kuwait",
  "phone": "+96512345679",
  "logo_url": "https://cdn.example.com/new-logo.png",
  "address_line_1": "Block 5, Shop 20",
  "city": "Kuwait City"
}
```

**Response** (200 OK):
```json
{
  "vendor": {
    "id": "vendor_01HXYZ123456789",
    "name": "My Updated Shop",
    "description": "Premium quality products from Kuwait",
    "email": "vendor@myshop.com",
    "phone": "+96512345679",
    "logo_url": "https://cdn.example.com/new-logo.png",
    "status": "verified",
    "commission_rate": 0.15,
    "address_line_1": "Block 5, Shop 20",
    "city": "Kuwait City",
    "country_code": "kw"
  }
}
```

#### List Vendor Products

```http
GET /store/vendors/me/products?email=vendor@myshop.com
```

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `email` | string | - | Vendor email (required) |
| `limit` | integer | 20 | Number of products |
| `offset` | integer | 0 | Pagination offset |

**Response** (200 OK):
```json
{
  "products": [
    {
      "id": "prod_01HXYZ123456789",
      "title": "Premium Kuwaiti Saffron",
      "subtitle": "Grade A Persian Saffron",
      "description": "Authentic saffron...",
      "handle": "premium-kuwaiti-saffron",
      "status": "published",
      "thumbnail": "https://cdn.example.com/saffron-thumb.jpg",
      "images": [...],
      "categories": [...],
      "variants": [
        {
          "id": "variant_01HX...",
          "title": "5g Pack",
          "sku": "SAF-5G",
          "inventory_quantity": 100,
          "prices": [...]
        }
      ],
      "created_at": "2026-01-15T10:30:00.000Z",
      "updated_at": "2026-01-28T14:22:00.000Z"
    }
  ],
  "count": 15,
  "offset": 0,
  "limit": 20
}
```

#### Create Product

Only verified/premium vendors can create products.

```http
POST /store/vendors/me/products?email=vendor@myshop.com
```

**Request Body**:
```json
{
  "title": "Organic Honey",
  "subtitle": "Pure Kuwaiti Desert Honey",
  "description": "100% organic honey collected from desert flowers...",
  "handle": "organic-honey",
  "status": "draft",
  "thumbnail": "https://cdn.example.com/honey-thumb.jpg",
  "images": [
    { "url": "https://cdn.example.com/honey-1.jpg" },
    { "url": "https://cdn.example.com/honey-2.jpg" }
  ],
  "categories": [
    { "id": "cat_01HX..." }
  ],
  "variants": [
    {
      "title": "500g Jar",
      "sku": "HON-500G",
      "prices": [
        { "amount": 5500, "currency_code": "kwd" },
        { "amount": 1799, "currency_code": "usd" }
      ],
      "inventory_quantity": 50,
      "manage_inventory": true
    }
  ]
}
```

**Response** (201 Created):
```json
{
  "product": {
    "id": "prod_01HXYZ...",
    "title": "Organic Honey",
    "handle": "organic-honey",
    "status": "draft",
    "created_at": "2026-01-30T11:00:00.000Z"
  }
}
```

**Error Responses**:

| Status | Type | Message |
|--------|------|---------|
| 400 | - | Product title is required |
| 403 | - | Your vendor account must be verified to create products |

#### Get Vendor Product

```http
GET /store/vendors/me/products/:id?email=vendor@myshop.com
```

**Response** (200 OK):
```json
{
  "product": {
    "id": "prod_01HXYZ123456789",
    "title": "Premium Kuwaiti Saffron",
    "subtitle": "Grade A Persian Saffron",
    "description": "Authentic saffron...",
    "handle": "premium-kuwaiti-saffron",
    "status": "published",
    "thumbnail": "https://cdn.example.com/saffron-thumb.jpg",
    "images": [...],
    "categories": [...],
    "variants": [...],
    "metadata": {
      "vendor_id": "vendor_01HX...",
      "vendor_name": "My Shop"
    },
    "created_at": "2026-01-15T10:30:00.000Z",
    "updated_at": "2026-01-28T14:22:00.000Z"
  }
}
```

#### Update Product

```http
PATCH /store/vendors/me/products/:id?email=vendor@myshop.com
```

**Request Body**:
```json
{
  "title": "Premium Kuwaiti Saffron - Updated",
  "status": "published",
  "description": "Updated description..."
}
```

**Response** (200 OK):
```json
{
  "product": {
    "id": "prod_01HXYZ123456789",
    "title": "Premium Kuwaiti Saffron - Updated",
    "handle": "premium-kuwaiti-saffron",
    "status": "published",
    "updated_at": "2026-01-30T11:30:00.000Z"
  }
}
```

#### Delete Product

```http
DELETE /store/vendors/me/products/:id?email=vendor@myshop.com
```

**Response** (200 OK):
```json
{
  "id": "prod_01HXYZ123456789",
  "deleted": true
}
```

#### List Vendor Orders

Returns orders containing the vendor's products.

```http
GET /store/vendors/me/orders?email=vendor@myshop.com
```

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `email` | string | - | Vendor email (required) |
| `limit` | integer | 20 | Number of orders |
| `offset` | integer | 0 | Pagination offset |

**Response** (200 OK):
```json
{
  "orders": [
    {
      "id": "order_01HXYZ123456789",
      "display_id": 1042,
      "status": "pending",
      "fulfillment_status": "not_fulfilled",
      "payment_status": "captured",
      "currency_code": "kwd",
      "total": 42525,
      "vendor_total": 30000,
      "vendor_items_count": 2,
      "items": [
        {
          "id": "item_01HX...",
          "title": "Premium Kuwaiti Saffron",
          "quantity": 2,
          "unit_price": 15000,
          "total": 30000,
          "thumbnail": "https://cdn.example.com/saffron-thumb.jpg",
          "variant": {
            "id": "variant_01HX...",
            "title": "5g Pack",
            "sku": "SAF-5G",
            "product": {
              "id": "prod_01HX...",
              "title": "Premium Kuwaiti Saffron",
              "handle": "premium-kuwaiti-saffron"
            }
          }
        }
      ],
      "shipping_address": {
        "first_name": "Ahmed",
        "last_name": "Al-Sabah",
        "address_1": "Block 5, Street 10, House 25",
        "city": "Hawalli",
        "postal_code": "22000",
        "country_code": "kw",
        "phone": "+96512345678"
      },
      "customer_email": "customer@example.com",
      "created_at": "2026-01-30T09:30:00.000Z",
      "updated_at": "2026-01-30T09:30:00.000Z"
    }
  ],
  "count": 15,
  "offset": 0,
  "limit": 20
}
```

#### Get Vendor Order

```http
GET /store/vendors/me/orders/:id?email=vendor@myshop.com
```

**Response** (200 OK):
```json
{
  "order": {
    "id": "order_01HXYZ123456789",
    "display_id": 1042,
    "status": "pending",
    "fulfillment_status": "not_fulfilled",
    "payment_status": "captured",
    "currency_code": "kwd",
    "total": 42525,
    "subtotal": 38500,
    "shipping_total": 2000,
    "tax_total": 2025,
    "vendor_total": 30000,
    "items": [...],
    "shipping_address": {...},
    "billing_address": {...},
    "fulfillments": [],
    "customer_email": "customer@example.com",
    "created_at": "2026-01-30T09:30:00.000Z",
    "updated_at": "2026-01-30T09:30:00.000Z"
  }
}
```

#### Update Order Fulfillment

Vendors can update fulfillment status for their portion of an order.

```http
PATCH /store/vendors/me/orders/:id?email=vendor@myshop.com
```

**Request Body**:
```json
{
  "fulfillment_status": "shipped",
  "tracking_number": "KW123456789",
  "notes": "Shipped via Aramex"
}
```

**Fulfillment Status Values**:
- `not_fulfilled`
- `partially_fulfilled`
- `fulfilled`
- `shipped`
- `delivered`

**Response** (200 OK):
```json
{
  "order": {
    "id": "order_01HXYZ123456789",
    "display_id": 1042,
    "vendor_fulfillment": {
      "status": "shipped",
      "tracking_number": "KW123456789",
      "notes": "Shipped via Aramex",
      "updated_at": "2026-01-30T12:00:00.000Z",
      "item_ids": ["item_01HX..."]
    }
  },
  "message": "Fulfillment status updated successfully"
}
```

#### Get Vendor Statistics

```http
GET /store/vendors/me/stats?email=vendor@myshop.com
```

**Response** (200 OK):
```json
{
  "stats": {
    "products": {
      "total": 15,
      "published": 12,
      "draft": 3
    },
    "orders": {
      "total": 48,
      "pending": 5,
      "completed": 43
    },
    "revenue": {
      "total": 4500000,
      "commission": 675000,
      "commission_rate": 0.15,
      "net": 3825000,
      "currency_code": "kwd"
    },
    "vendor": {
      "id": "vendor_01HXYZ123456789",
      "name": "My Shop",
      "status": "verified",
      "member_since": "2026-01-15T10:00:00.000Z"
    }
  }
}
```

**Notes**:
- Revenue values are in the smallest currency unit (e.g., 4500000 = 4,500.000 KWD)
- Commission is calculated as: `total * commission_rate`
- Net revenue is: `total - commission`

---

## 4. Admin API Endpoints

All admin endpoints require authentication with an admin user token.

### 4.1 Vendor Management

#### List All Vendors

```http
GET /admin/vendors
```

**Headers**:
```http
Authorization: Bearer <admin_token>
```

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `status` | string | - | Filter by status |
| `limit` | integer | 50 | Number of vendors |
| `offset` | integer | 0 | Pagination offset |

**Status Values**:
- `pending` - Awaiting approval
- `verified` - Approved vendor
- `premium` - Premium tier vendor
- `suspended` - Suspended/rejected vendor

**Response** (200 OK):
```json
{
  "vendors": [
    {
      "id": "vendor_01HXYZ123456789",
      "name": "My Shop",
      "description": "Quality products from Kuwait",
      "email": "vendor@myshop.com",
      "phone": "+96512345678",
      "logo_url": "https://cdn.example.com/logo.png",
      "status": "pending",
      "commission_rate": 0.15,
      "business_registration": "CR-12345",
      "bank_account": null,
      "address_line_1": "Block 3, Shop 15",
      "address_line_2": null,
      "city": "Salmiya",
      "postal_code": "22000",
      "country_code": "kw",
      "created_at": "2026-01-30T10:00:00.000Z",
      "updated_at": "2026-01-30T10:00:00.000Z"
    }
  ],
  "count": 25,
  "offset": 0,
  "limit": 50
}
```

#### Get Vendor Details

```http
GET /admin/vendors/:id
```

**Headers**:
```http
Authorization: Bearer <admin_token>
```

**Response** (200 OK):
```json
{
  "vendor": {
    "id": "vendor_01HXYZ123456789",
    "name": "My Shop",
    "description": "Quality products from Kuwait",
    "email": "vendor@myshop.com",
    "phone": "+96512345678",
    "logo_url": "https://cdn.example.com/logo.png",
    "status": "pending",
    "commission_rate": 0.15,
    "business_registration": "CR-12345",
    "bank_account": "KW91KFHO0000000000001234567890",
    "address_line_1": "Block 3, Shop 15",
    "address_line_2": null,
    "city": "Salmiya",
    "postal_code": "22000",
    "country_code": "kw",
    "created_at": "2026-01-30T10:00:00.000Z",
    "updated_at": "2026-01-30T10:00:00.000Z"
  }
}
```

#### Create Vendor (Admin)

```http
POST /admin/vendors
```

**Headers**:
```http
Authorization: Bearer <admin_token>
```

**Request Body**:
```json
{
  "name": "New Vendor",
  "email": "newvendor@example.com",
  "phone": "+96512345678",
  "description": "Description here",
  "business_registration": "CR-54321",
  "commission_rate": 0.12,
  "status": "verified",
  "address_line_1": "Block 1, Shop 5",
  "city": "Kuwait City",
  "postal_code": "10000",
  "country_code": "kw"
}
```

**Response** (201 Created):
```json
{
  "vendor": {
    "id": "vendor_02HXYZ...",
    "name": "New Vendor",
    "email": "newvendor@example.com",
    "status": "verified",
    "commission_rate": 0.12,
    "created_at": "2026-01-30T14:00:00.000Z"
  }
}
```

#### Update Vendor

```http
PATCH /admin/vendors/:id
```

**Headers**:
```http
Authorization: Bearer <admin_token>
```

**Request Body**:
```json
{
  "name": "Updated Vendor Name",
  "commission_rate": 0.10,
  "status": "premium",
  "bank_account": "KW91KFHO0000000000001234567890"
}
```

**Validation**:
- `status` must be one of: `pending`, `verified`, `premium`, `suspended`
- `commission_rate` must be between 0 and 1

**Response** (200 OK):
```json
{
  "vendor": {
    "id": "vendor_01HXYZ123456789",
    "name": "Updated Vendor Name",
    "commission_rate": 0.10,
    "status": "premium"
  }
}
```

#### Delete Vendor

```http
DELETE /admin/vendors/:id
```

**Headers**:
```http
Authorization: Bearer <admin_token>
```

**Response** (200 OK):
```json
{
  "id": "vendor_01HXYZ123456789",
  "deleted": true
}
```

#### Approve Vendor

```http
POST /admin/vendors/:id/approve
```

**Headers**:
```http
Authorization: Bearer <admin_token>
```

**Request Body** (optional):
```json
{
  "commission_rate": 0.12
}
```

**Response** (200 OK):
```json
{
  "message": "Vendor approved successfully",
  "vendor": {
    "id": "vendor_01HXYZ123456789",
    "name": "My Shop",
    "status": "verified",
    "commission_rate": 0.12
  }
}
```

**Error Responses**:

| Status | Type | Message |
|--------|------|---------|
| 400 | - | Vendor is already approved |
| 400 | - | Commission rate must be between 0 and 1 |
| 404 | - | Vendor not found |

#### Reject Vendor

```http
POST /admin/vendors/:id/reject
```

**Headers**:
```http
Authorization: Bearer <admin_token>
```

**Request Body** (optional):
```json
{
  "reason": "Incomplete business documentation"
}
```

**Response** (200 OK):
```json
{
  "message": "Vendor rejected successfully",
  "vendor": {
    "id": "vendor_01HXYZ123456789",
    "name": "My Shop",
    "status": "suspended"
  },
  "reason": "Incomplete business documentation"
}
```

**Error Responses**:

| Status | Type | Message |
|--------|------|---------|
| 400 | - | Vendor is already suspended |
| 404 | - | Vendor not found |

---

## 5. Webhooks

### 5.1 Stripe Webhooks

Configure webhook endpoint at `/webhooks/stripe` in your Medusa backend.

**Events Supported**:

| Event | Description |
|-------|-------------|
| `payment_intent.succeeded` | Payment captured successfully |
| `payment_intent.payment_failed` | Payment failed |
| `payment_intent.canceled` | Payment canceled |
| `charge.refunded` | Refund processed |

**Webhook Configuration**:
```bash
# Set webhook secret in environment
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

**Webhook Verification**:
All incoming webhooks are verified using the `stripe-signature` header.

### 5.2 PayPal Webhooks

Configure webhook endpoint at `/webhooks/paypal` in your Medusa backend.

**Events Supported**:

| Event | Description |
|-------|-------------|
| `PAYMENT.CAPTURE.COMPLETED` | Payment captured |
| `PAYMENT.CAPTURE.DENIED` | Payment denied |
| `PAYMENT.CAPTURE.REFUNDED` | Refund processed |

**Webhook Configuration**:
```bash
# Set webhook ID in environment
PAYPAL_WEBHOOK_ID=xxxxxxxxxxxxx
```

### 5.3 Webhook Security

All webhooks should:
1. Verify signature/source authenticity
2. Return 200 OK promptly (process async)
3. Handle duplicate events (idempotency)
4. Log all received events for debugging

---

## 6. Error Codes

### HTTP Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST (resource created) |
| 400 | Bad Request | Invalid input, validation error |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists |
| 410 | Gone | Resource expired (e.g., OTP) |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |

### Error Types

| Type | Description |
|------|-------------|
| `invalid_data` | Request validation failed |
| `unauthorized` | Authentication required or failed |
| `not_found` | Requested resource not found |
| `conflict` | Resource conflict (e.g., duplicate email) |
| `rate_limit` | Rate limit exceeded |
| `otp_expired` | OTP has expired |
| `invalid_otp` | Incorrect OTP code |
| `otp_not_found` | No OTP exists for phone |
| `max_attempts` | Maximum verification attempts exceeded |
| `unexpected_error` | Internal server error |

### Error Response Format

```json
{
  "type": "invalid_data",
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "phone",
      "message": "Phone number must be at least 8 digits"
    }
  ]
}
```

---

## 7. Rate Limiting

### Default Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| General API | 1000 requests | per minute |
| OTP Send | 3 requests | per 5 minutes per phone |
| OTP Verify | 5 attempts | per OTP |
| Authentication | 10 requests | per minute per IP |

### Rate Limit Headers

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1706612400
```

### Rate Limit Response (429)

```json
{
  "type": "rate_limit",
  "message": "Too many requests. Please try again later.",
  "retry_after": 60
}
```

### OTP-Specific Limits

| Limit | Value | Description |
|-------|-------|-------------|
| OTP Length | 6 digits | Numeric code |
| OTP Expiry | 5 minutes | Time until OTP expires |
| Max Send Attempts | 3 per phone | Per 5 minute window |
| Max Verify Attempts | 5 per OTP | Before OTP invalidation |
| Max Requests/Hour | Configurable | Hourly rate limit per phone |

---

## Appendix A: Currency Handling

All monetary values are stored and returned in the **smallest currency unit**:

| Currency | Unit | Example |
|----------|------|---------|
| KWD (Kuwait Dinar) | Fils | 15000 = 15.000 KWD |
| USD (US Dollar) | Cents | 4999 = $49.99 |
| EUR (Euro) | Cents | 4999 = EUR 49.99 |

**Conversion Formula**:
```
Display Amount = API Amount / (10 ^ decimal_digits)

KWD: amount / 1000 (3 decimal places)
USD/EUR: amount / 100 (2 decimal places)
```

---

## Appendix B: Vendor Status Workflow

```
[Application Submitted]
        |
        v
    +--------+
    | pending |
    +----+---+
         |
    +----+----+
    |         |
    v         v
+-------+  +---------+
|verified|  |suspended|
+---+---+  +---------+
    |           ^
    v           |
+-------+       |
|premium| ------+
+-------+
```

| Status | Can List Products | Can Sell | Visible to Customers |
|--------|------------------|----------|---------------------|
| pending | No | No | No |
| verified | Yes | Yes | Yes |
| premium | Yes | Yes | Yes (featured) |
| suspended | No | No | No |

---

## Appendix C: SDK Examples

### JavaScript/TypeScript

```typescript
// Using fetch
const response = await fetch('http://localhost:9000/store/products', {
  headers: {
    'Content-Type': 'application/json',
    'x-publishable-api-key': 'pk_live_xxx'
  }
});
const { products } = await response.json();

// Using Medusa JS SDK
import Medusa from '@medusajs/medusa-js';

const medusa = new Medusa({
  baseUrl: 'http://localhost:9000',
  maxRetries: 3
});

const { products } = await medusa.products.list();
```

### cURL

```bash
# List products
curl -X GET "http://localhost:9000/store/products" \
  -H "Content-Type: application/json" \
  -H "x-publishable-api-key: pk_live_xxx"

# Send OTP
curl -X POST "http://localhost:9000/store/auth/otp/send" \
  -H "Content-Type: application/json" \
  -d '{"phone": "+96512345678"}'

# Create cart
curl -X POST "http://localhost:9000/store/carts" \
  -H "Content-Type: application/json" \
  -d '{"region_id": "reg_01HXYZ..."}'
```

---

## Related Documents

- [Product Requirements Document](./PRD.md)
- [Technical Specification](./TECHNICAL_SPEC.md)
- [Data Models](./DATA_MODELS.md)
- [Integration Guide](./INTEGRATION_GUIDE.md)
- [Deployment Guide](./DEPLOYMENT.md)
