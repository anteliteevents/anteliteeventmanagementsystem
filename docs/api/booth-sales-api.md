# Booth Sales API Documentation

## Overview

This API handles booth sales, reservations, payments, and related operations for the Ant Elite Events System.

## Base URL

```
http://localhost:3001/api
```

## Authentication

Most endpoints require authentication via JWT token. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### 1. Get Available Booths

Get all available booths for an event.

**Endpoint:** `GET /booths/available`

**Query Parameters:**
- `eventId` (required): Event ID
- `size` (optional): Filter by booth size (small, medium, large, xlarge)
- `minPrice` (optional): Minimum price filter
- `maxPrice` (optional): Maximum price filter

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "eventId": "uuid",
      "boothNumber": "A1",
      "size": "medium",
      "price": 1500.00,
      "status": "available",
      "locationX": 10,
      "locationY": 20,
      "width": 1,
      "height": 1,
      "description": "Premium location",
      "amenities": ["wifi", "power"],
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### 2. Reserve a Booth

Reserve a booth for 15 minutes (pending payment).

**Endpoint:** `POST /booths/reserve`

**Headers:**
- `Authorization: Bearer <token>` (required)

**Request Body:**
```json
{
  "boothId": "uuid",
  "eventId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "boothId": "uuid",
    "exhibitorId": "uuid",
    "eventId": "uuid",
    "status": "pending",
    "reservedAt": "2024-01-01T00:00:00Z",
    "expiresAt": "2024-01-01T00:15:00Z",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "message": "Booth reserved successfully. Please complete payment within 15 minutes."
}
```

**Notes:**
- Reservation expires in 15 minutes
- Confirmation email is sent automatically
- Booth status changes to "reserved"

---

### 3. Create Purchase (Payment Intent)

Create a Stripe payment intent for booth purchase.

**Endpoint:** `POST /booths/purchase`

**Headers:**
- `Authorization: Bearer <token>` (required)

**Request Body:**
```json
{
  "reservationId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transactionId": "uuid",
    "paymentIntentId": "pi_xxx",
    "clientSecret": "pi_xxx_secret_xxx",
    "amount": 1500.00,
    "currency": "USD"
  },
  "message": "Payment intent created successfully"
}
```

**Notes:**
- Use `clientSecret` on the frontend to confirm payment with Stripe
- If transaction already exists, returns existing payment intent

---

### 4. Confirm Payment

Confirm payment completion and finalize booking.

**Endpoint:** `POST /booths/confirm-payment`

**Headers:**
- `Authorization: Bearer <token>` (required)

**Request Body:**
```json
{
  "paymentIntentId": "pi_xxx"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transaction": {
      "id": "uuid",
      "reservationId": "uuid",
      "amount": 1500.00,
      "currency": "USD",
      "status": "completed",
      "paymentMethod": "stripe",
      "stripePaymentIntentId": "pi_xxx",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    },
    "reservation": {
      "id": "uuid",
      "boothId": "uuid",
      "exhibitorId": "uuid",
      "eventId": "uuid",
      "status": "confirmed",
      "confirmedAt": "2024-01-01T00:00:00Z"
    },
    "invoice": {
      "id": "uuid",
      "invoiceNumber": "INV-XXX",
      "amount": 1500.00,
      "taxAmount": 0,
      "totalAmount": 1500.00,
      "status": "paid"
    }
  },
  "message": "Payment confirmed and booking completed successfully"
}
```

**Notes:**
- Booth status changes to "booked"
- Invoice is automatically created and marked as paid
- Payment confirmation email is sent
- Real-time update is emitted via Socket.io

---

### 5. Get My Reservations

Get all reservations for the current user.

**Endpoint:** `GET /booths/my-reservations`

**Headers:**
- `Authorization: Bearer <token>` (required)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "boothId": "uuid",
      "exhibitorId": "uuid",
      "eventId": "uuid",
      "status": "confirmed",
      "boothNumber": "A1",
      "size": "medium",
      "price": 1500.00,
      "eventName": "Tech Expo 2024",
      "reservedAt": "2024-01-01T00:00:00Z",
      "confirmedAt": "2024-01-01T00:05:00Z",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:05:00Z"
    }
  ]
}
```

---

## Stripe Webhook

### Webhook Endpoint

**Endpoint:** `POST /webhooks/stripe`

This endpoint handles Stripe webhook events automatically. Configure it in your Stripe dashboard.

**Supported Events:**
- `payment_intent.succeeded` - Automatically confirms reservation and sends confirmation email
- `payment_intent.payment_failed` - Marks transaction as failed
- `payment_intent.canceled` - Cancels reservation and releases booth

**Note:** This endpoint requires raw body parsing and Stripe signature verification.

---

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  }
}
```

### Common Error Codes

- `UNAUTHORIZED` - Missing or invalid authentication token
- `FORBIDDEN` - User doesn't have permission
- `NOT_FOUND` - Resource not found
- `VALIDATION_ERROR` - Invalid request parameters
- `BOOTH_UNAVAILABLE` - Booth is not available
- `BOOTH_RESERVED` - Booth is already reserved
- `RESERVATION_EXPIRED` - Reservation has expired
- `PAYMENT_NOT_COMPLETED` - Payment intent not in succeeded status
- `INTERNAL_ERROR` - Server error

---

## Real-time Updates (Socket.io)

The API emits real-time updates via Socket.io for booth status changes:

**Events:**
- `booth-reserved` - Emitted when a booth is reserved
- `booth-booked` - Emitted when a booth is booked (payment confirmed)
- `booth-released` - Emitted when a booth reservation is cancelled

**Client Connection:**
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

// Join event room
socket.emit('join-event', eventId);

// Listen for updates
socket.on('booth-reserved', (data) => {
  console.log('Booth reserved:', data);
});

socket.on('booth-booked', (data) => {
  console.log('Booth booked:', data);
});
```

---

## Email Notifications

The system automatically sends email notifications for:

1. **Reservation Confirmation** - Sent when a booth is reserved
2. **Payment Confirmation** - Sent when payment is completed
3. **Invoice** - Sent when invoice is generated (future feature)
4. **Reservation Cancellation** - Sent when reservation is cancelled

Email templates are HTML-formatted and include all relevant booking details.

---

## Flow Diagram

```
1. User selects booth → GET /booths/available
2. User reserves booth → POST /booths/reserve (15 min hold)
3. User initiates payment → POST /booths/purchase (creates Stripe payment intent)
4. User completes payment → Frontend confirms with Stripe
5. Backend confirms → POST /booths/confirm-payment OR Stripe webhook
6. Booking finalized → Invoice created, emails sent, real-time update
```

---

## Testing

### Test with Stripe Test Mode

1. Use Stripe test API keys
2. Use test card numbers (e.g., `4242 4242 4242 4242`)
3. Configure webhook endpoint in Stripe dashboard for local testing using Stripe CLI

### Stripe CLI for Local Webhook Testing

```bash
stripe listen --forward-to localhost:3001/api/webhooks/stripe
```

