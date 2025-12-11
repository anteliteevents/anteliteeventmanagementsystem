# Ant Elite Events System

A comprehensive event management system for booth sales, exhibitor registration, and real-time floor plan management.

## 🎯 Project Overview

This system provides an MVP for managing event booths with real-time availability updates, exhibitor registration, payment processing, and administrative dashboards.

### Key Features

- **Booth Sales Portal**: Interactive floor plan with real-time availability
- **Exhibitor Registration**: Self-service registration and booth selection
- **Real-time Updates**: Socket.io integration for live booth status changes
- **Payment Processing**: Stripe integration for secure transactions
- **Role-based Access**: Admin and Exhibitor dashboards
- **Automated Invoicing**: System-generated invoices for bookings

## 🏗️ Tech Stack

### Frontend

- **React** with TypeScript
- **Socket.io Client** for real-time updates
- Modern UI framework (to be determined)

### Backend

- **Node.js** with **Express**
- **PostgreSQL** database
- **JWT** authentication
- **Socket.io** server for real-time communication
- **Stripe** payment integration

## 📁 Project Structure

```
anteliteeventssystem/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── hooks/           # Custom React hooks
│   │   ├── context/         # React context providers
│   │   ├── utils/           # Utility functions
│   │   └── types/           # TypeScript type definitions
│   ├── public/
│   └── package.json
│
├── backend/                  # Node.js/Express backend
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # Database models
│   │   ├── middleware/      # Express middleware
│   │   ├── services/        # Business logic services
│   │   ├── config/          # Configuration files
│   │   ├── utils/           # Utility functions
│   │   └── types/           # TypeScript type definitions
│   ├── migrations/          # Database migrations
│   └── package.json
│
├── database/                 # Database related files
│   ├── schema.sql           # Database schema
│   └── seeds.sql            # Seed data
│
├── docs/                     # Documentation
│   ├── api/                 # API documentation
│   └── architecture.md      # Architecture documentation
│
└── .cursor/                  # Cursor IDE rules
```

## 🚀 Getting Started

### Quick Start

**For detailed step-by-step instructions, see: [`docs/getting-started.md`](docs/getting-started.md)**

### Prerequisites

- Node.js (v18 or higher) - [Download](https://nodejs.org/)
- PostgreSQL (v14 or higher) - [Download](https://www.postgresql.org/download/)
- npm or yarn (comes with Node.js)

### Quick Installation

1. **Clone the repository** (if applicable)

   ```bash
   git clone <repository-url>
   cd anteliteeventssystem
   ```

2. **Setup Database**

   ```bash
   # Create database
   createdb antelite_events

   # Run schema
   psql -U postgres -d antelite_events -f database/schema.sql
   ```

3. **Setup Backend**

   ```bash
   cd backend
   npm install
   # Create .env file (see docs/getting-started.md)
   npm run build
   npm run dev
   ```

4. **Setup Frontend** (in new terminal)

   ```bash
   cd frontend
   npm install
   # Create .env file (see docs/getting-started.md)
   npm start
   ```

5. **Verify**
   - Backend: http://localhost:3001/health
   - Frontend: http://localhost:3000

**📖 For detailed setup instructions, environment variables, and troubleshooting, see [`docs/getting-started.md`](docs/getting-started.md)**

## 🚀 Server Deployment

**Ready to deploy to production?** See our complete guides:

- **[Server Setup Guide](docs/server-setup-guide.md)** - Complete step-by-step server setup
- **[Deployment Guide](docs/deployment.md)** - Detailed deployment options
- **[Learning Path](docs/learning-path.md)** - Learn server management
- **[Windows Setup](docs/windows-setup.md)** - Windows-specific instructions

**Quick Deploy Options:**

- **Contabo VPS** (€4-8/month) - Best value, full control
- **Railway.app** ($0-5/month) - Easiest, managed service
- **DigitalOcean** ($6-12/month) - Great tutorials

## 📋 Development Roadmap

### Phase 1: MVP Core Features

- [x] Project structure setup
- [ ] Database schema implementation
- [ ] Authentication system (JWT)
- [ ] Booth selection component
- [ ] Real-time availability updates
- [ ] Basic payment flow

### Phase 2: Enhanced Features

- [ ] Interactive floor plan with drag-select
- [ ] Role-based dashboards
- [ ] Automated invoicing
- [ ] Email notifications

### Phase 3: Advanced Features

- [ ] Analytics and reporting
- [ ] Multi-event support
- [ ] Advanced filtering and search
- [ ] Mobile responsiveness

## 🔧 Environment Variables

### Backend (.env)

```
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=antelite_events
DB_USER=your_db_user
DB_PASSWORD=your_db_password
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)

```
REACT_APP_API_URL=http://localhost:3001
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
REACT_APP_SOCKET_URL=http://localhost:3001
```

## 📝 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new exhibitor
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Booths

- `GET /api/booths/available` - Get available booths
- `GET /api/booths/:id` - Get booth details
- `POST /api/booths/reserve` - Reserve a booth
- `PUT /api/booths/:id` - Update booth status

### Exhibitors

- `GET /api/exhibitors` - Get all exhibitors (admin)
- `GET /api/exhibitors/:id` - Get exhibitor details
- `POST /api/exhibitors/register` - Register new exhibitor
- `PUT /api/exhibitors/:id` - Update exhibitor info

### Events

- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create event (admin)
- `PUT /api/events/:id` - Update event (admin)

### Transactions

- `POST /api/transactions` - Create transaction
- `GET /api/transactions/:id` - Get transaction details
- `POST /api/transactions/:id/payment` - Process payment

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📄 License

[Specify your license here]

## 👥 Contributors

[Add contributors here]
# anteliteevents
# anteliteeventmanagementsystem
