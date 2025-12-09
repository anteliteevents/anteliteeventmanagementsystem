# Architecture Documentation

## System Architecture Overview

The Ant Elite Events System follows a modern full-stack architecture with clear separation between frontend and backend.

## Architecture Diagram

```
┌─────────────────┐
│   React Client  │
│   (Frontend)    │
└────────┬────────┘
         │
         │ HTTP/REST API
         │ WebSocket (Socket.io)
         │
┌────────▼────────┐
│  Express Server │
│   (Backend)     │
└────────┬────────┘
         │
         │ SQL Queries
         │
┌────────▼────────┐
│   PostgreSQL    │
│   (Database)    │
└─────────────────┘
         │
         │ Payment API
         │
┌────────▼────────┐
│  Stripe API     │
└─────────────────┘
```

## Frontend Architecture

### Component Structure
```
src/
├── components/
│   ├── common/          # Reusable UI components
│   ├── booth/           # Booth-related components
│   ├── floor-plan/      # Floor plan visualization
│   └── dashboard/       # Dashboard components
├── pages/
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── BoothSelection.tsx
│   ├── ExhibitorDashboard.tsx
│   └── AdminDashboard.tsx
├── services/
│   ├── api.ts           # Axios instance and API calls
│   ├── socket.ts         # Socket.io client setup
│   └── auth.ts           # Authentication service
├── hooks/
│   ├── useAuth.ts
│   ├── useBooths.ts
│   └── useSocket.ts
├── context/
│   ├── AuthContext.tsx
│   └── SocketContext.tsx
└── types/
    └── index.ts          # TypeScript type definitions
```

### State Management
- **React Context API** for global state (auth, socket)
- **React Query** for server state management
- **Local State** for component-specific state

## Backend Architecture

### Directory Structure
```
src/
├── routes/
│   ├── auth.routes.ts
│   ├── booths.routes.ts
│   ├── exhibitors.routes.ts
│   ├── events.routes.ts
│   └── transactions.routes.ts
├── controllers/
│   ├── auth.controller.ts
│   ├── booths.controller.ts
│   ├── exhibitors.controller.ts
│   ├── events.controller.ts
│   └── transactions.controller.ts
├── models/
│   ├── User.ts
│   ├── Booth.ts
│   ├── Event.ts
│   ├── Reservation.ts
│   └── Transaction.ts
├── services/
│   ├── auth.service.ts
│   ├── booth.service.ts
│   ├── payment.service.ts
│   └── email.service.ts
├── middleware/
│   ├── auth.middleware.ts
│   ├── validation.middleware.ts
│   └── error.middleware.ts
└── config/
    ├── database.ts
    ├── socket.io.ts
    └── stripe.ts
```

### API Design Principles
- **RESTful** endpoints
- **JWT** for authentication
- **Middleware** for validation and error handling
- **Service layer** for business logic separation

## Database Schema

### Core Entities
1. **Events** - Event information
2. **Users** - Admin and exhibitor accounts
3. **Booths** - Booth details and availability
4. **Reservations** - Booth bookings
5. **Transactions** - Payment records
6. **Invoices** - Generated invoices
7. **Floor Plans** - Floor plan configurations

### Relationships
- Event → Booths (1:N)
- Event → Reservations (1:N)
- User → Reservations (1:N)
- Booth → Reservations (1:N)
- Reservation → Transaction (1:1)
- Reservation → Invoice (1:1)

## Real-time Communication

### Socket.io Events

#### Client → Server
- `join:event` - Join event room for updates
- `leave:event` - Leave event room
- `reserve:booth` - Reserve a booth
- `cancel:reservation` - Cancel reservation

#### Server → Client
- `boothStatusUpdate` - Booth status changed
- `reservationUpdate` - Reservation status changed
- `eventUpdate` - Event information updated

## Security

### Authentication & Authorization
- **JWT tokens** for stateless authentication
- **Role-based access control** (admin/exhibitor)
- **Password hashing** with bcrypt
- **Token expiration** and refresh mechanism

### Data Protection
- **Input validation** on all endpoints
- **SQL injection** prevention (parameterized queries)
- **CORS** configuration
- **Helmet.js** for security headers
- **Rate limiting** (to be implemented)

## Payment Flow

1. User selects booth(s)
2. System creates reservation (pending status)
3. User proceeds to checkout
4. Frontend creates Stripe Payment Intent
5. User completes payment via Stripe
6. Webhook confirms payment
7. Reservation status → confirmed
8. Invoice generated automatically
9. Email notification sent

## Error Handling

### Frontend
- Global error boundary
- API error interceptors
- User-friendly error messages
- Toast notifications

### Backend
- Centralized error middleware
- Standardized error responses
- Logging for debugging
- Validation error handling

## Performance Considerations

- **Database indexes** on frequently queried columns
- **Connection pooling** for database
- **Caching** strategy (to be implemented)
- **Lazy loading** for components
- **Code splitting** in frontend bundle

## Deployment

### Recommended Stack
- **Frontend**: Vercel, Netlify, or AWS S3 + CloudFront
- **Backend**: AWS EC2, Heroku, or DigitalOcean
- **Database**: AWS RDS, Heroku Postgres, or managed PostgreSQL
- **WebSocket**: Same server as backend or separate Socket.io server

### Environment Variables
- Separate `.env` files for development, staging, production
- Never commit `.env` files to version control
- Use secrets management in production

