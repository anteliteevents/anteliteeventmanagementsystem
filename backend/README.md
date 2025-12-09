# Ant Elite Events System - Backend API

Backend API for booth sales with Stripe integration and email notifications.

## Features

✅ **Booth Sales API**
- Get available booths
- Reserve booths (15-minute hold)
- Create payment intents
- Confirm payments
- View reservations

✅ **Stripe Integration**
- Payment intent creation
- Webhook handling
- Customer management
- Refund support

✅ **Email Notifications**
- Reservation confirmations
- Payment confirmations
- Invoice emails
- Cancellation notifications

✅ **Real-time Updates**
- Socket.io integration
- Live booth status updates
- Event room management

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=3001
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=antelite_events
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_secret_key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# CORS
CORS_ORIGIN=http://localhost:3000

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=noreply@anteliteevents.com
```

### 3. Setup Database

Run the database schema:

```bash
psql -U postgres -d antelite_events -f ../database/schema.sql
```

### 4. Run the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm run build
npm start
```

## API Endpoints

### Booth Sales

- `GET /api/booths/available?eventId=xxx` - Get available booths
- `POST /api/booths/reserve` - Reserve a booth
- `POST /api/booths/purchase` - Create payment intent
- `POST /api/booths/confirm-payment` - Confirm payment
- `GET /api/booths/my-reservations` - Get user's reservations

### Webhooks

- `POST /api/webhooks/stripe` - Stripe webhook handler

See [API Documentation](../docs/api/booth-sales-api.md) for detailed endpoint documentation.

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.ts  # PostgreSQL connection
│   │   └── socket.io.ts # Socket.io setup
│   ├── controllers/     # Route controllers
│   │   ├── boothSales.controller.ts
│   │   └── stripeWebhook.controller.ts
│   ├── middleware/      # Express middleware
│   │   └── auth.middleware.ts
│   ├── models/          # Database models
│   │   ├── booth.model.ts
│   │   ├── reservation.model.ts
│   │   ├── transaction.model.ts
│   │   ├── invoice.model.ts
│   │   ├── user.model.ts
│   │   └── event.model.ts
│   ├── routes/          # API routes
│   │   ├── boothSales.routes.ts
│   │   └── stripeWebhook.routes.ts
│   ├── services/        # Business logic services
│   │   ├── stripe.service.ts
│   │   └── email.service.ts
│   ├── types/           # TypeScript types
│   │   └── index.ts
│   └── server.ts        # Express server
├── package.json
└── tsconfig.json
```

## Stripe Webhook Setup

### Local Development

Use Stripe CLI to forward webhooks to your local server:

```bash
stripe listen --forward-to localhost:3001/api/webhooks/stripe
```

The CLI will provide a webhook secret. Add it to your `.env` file as `STRIPE_WEBHOOK_SECRET`.

### Production

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `payment_intent.canceled`
4. Copy the webhook signing secret to your `.env` file

## Email Configuration

### Gmail Setup

1. Enable 2-Factor Authentication
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the app password in `SMTP_PASSWORD`

### Other SMTP Providers

Update the SMTP configuration in `.env` to match your provider's settings.

## Testing

### Test Stripe Payments

Use Stripe test mode with test card numbers:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

### Test Webhooks Locally

```bash
# Terminal 1: Start server
npm run dev

# Terminal 2: Forward webhooks
stripe listen --forward-to localhost:3001/api/webhooks/stripe

# Terminal 3: Trigger test event
stripe trigger payment_intent.succeeded
```

## Error Handling

All API responses follow this format:

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message"
  }
}
```

## Security

- JWT authentication for protected routes
- Helmet.js for security headers
- CORS configuration
- Input validation
- SQL injection protection (parameterized queries)
- Stripe webhook signature verification

## License

ISC

