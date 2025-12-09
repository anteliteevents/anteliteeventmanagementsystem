# Project Structure Overview

This document provides a comprehensive overview of the Ant Elite Events System project structure.

## 📁 Directory Tree

```
anteliteeventssystem/
│
├── 📄 README.md                    # Main project documentation
├── 📄 PROJECT_STRUCTURE.md          # This file
├── 📄 project_config.md             # MVP configuration and requirements
├── 📄 .gitignore                   # Git ignore rules
│
├── 📁 frontend/                    # React frontend application
│   ├── 📄 package.json             # Frontend dependencies
│   ├── 📄 .env.example             # Frontend environment variables template
│   │
│   └── 📁 src/                     # Source code
│       ├── 📁 components/          # React components
│       │   └── 📄 BoothSelection.tsx  # Booth selection component (MVP)
│       │
│       ├── 📁 pages/               # Page components
│       │   ├── 📄 Home.tsx         # (To be created)
│       │   ├── 📄 Login.tsx        # (To be created)
│       │   ├── 📄 Register.tsx     # (To be created)
│       │   ├── 📄 ExhibitorDashboard.tsx  # (To be created)
│       │   └── 📄 AdminDashboard.tsx      # (To be created)
│       │
│       ├── 📁 services/            # API and external services
│       │   ├── 📄 api.ts           # Axios instance and API calls
│       │   ├── 📄 socket.ts        # Socket.io client setup
│       │   └── 📄 auth.ts          # (To be created)
│       │
│       ├── 📁 hooks/                # Custom React hooks
│       │   ├── 📄 useAuth.ts       # (To be created)
│       │   ├── 📄 useBooths.ts     # (To be created)
│       │   └── 📄 useSocket.ts     # (To be created)
│       │
│       ├── 📁 context/              # React context providers
│       │   ├── 📄 AuthContext.tsx  # (To be created)
│       │   └── 📄 SocketContext.tsx # (To be created)
│       │
│       ├── 📁 utils/                # Utility functions
│       │   └── 📄 (To be created)
│       │
│       ├── 📁 types/                # TypeScript type definitions
│       │   └── 📄 index.ts         # All type definitions
│       │
│       ├── 📁 public/               # Static assets
│       │   └── 📄 (To be created)
│       │
│       └── 📄 App.tsx               # (To be created)
│       └── 📄 index.tsx             # (To be created)
│
├── 📁 backend/                      # Node.js/Express backend
│   ├── 📄 package.json              # Backend dependencies
│   ├── 📄 tsconfig.json             # TypeScript configuration
│   ├── 📄 .env.example              # Backend environment variables template
│   │
│   ├── 📁 src/                      # Source code
│   │   ├── 📄 server.ts             # Express server entry point
│   │   │
│   │   ├── 📁 routes/               # API route definitions
│   │   │   ├── 📄 auth.routes.ts    # (To be created)
│   │   │   ├── 📄 booths.routes.ts  # (To be created)
│   │   │   ├── 📄 exhibitors.routes.ts  # (To be created)
│   │   │   ├── 📄 events.routes.ts  # (To be created)
│   │   │   └── 📄 transactions.routes.ts  # (To be created)
│   │   │
│   │   ├── 📁 controllers/          # Route controllers
│   │   │   ├── 📄 auth.controller.ts     # (To be created)
│   │   │   ├── 📄 booths.controller.ts   # (To be created)
│   │   │   ├── 📄 exhibitors.controller.ts  # (To be created)
│   │   │   ├── 📄 events.controller.ts   # (To be created)
│   │   │   └── 📄 transactions.controller.ts  # (To be created)
│   │   │
│   │   ├── 📁 models/               # Database models
│   │   │   ├── 📄 User.ts           # (To be created)
│   │   │   ├── 📄 Booth.ts          # (To be created)
│   │   │   ├── 📄 Event.ts          # (To be created)
│   │   │   ├── 📄 Reservation.ts    # (To be created)
│   │   │   └── 📄 Transaction.ts    # (To be created)
│   │   │
│   │   ├── 📁 services/              # Business logic services
│   │   │   ├── 📄 auth.service.ts   # (To be created)
│   │   │   ├── 📄 booth.service.ts  # (To be created)
│   │   │   ├── 📄 payment.service.ts  # (To be created)
│   │   │   └── 📄 email.service.ts  # (To be created)
│   │   │
│   │   ├── 📁 middleware/            # Express middleware
│   │   │   ├── 📄 auth.middleware.ts     # (To be created)
│   │   │   ├── 📄 validation.middleware.ts  # (To be created)
│   │   │   └── 📄 error.middleware.ts     # (To be created)
│   │   │
│   │   ├── 📁 config/                # Configuration files
│   │   │   ├── 📄 database.ts        # PostgreSQL connection
│   │   │   ├── 📄 socket.io.ts       # Socket.io setup
│   │   │   └── 📄 stripe.ts          # (To be created)
│   │   │
│   │   ├── 📁 utils/                 # Utility functions
│   │   │   └── 📄 (To be created)
│   │   │
│   │   └── 📁 types/                 # TypeScript type definitions
│   │       └── 📄 index.ts           # All type definitions
│   │
│   └── 📁 migrations/                # Database migrations
│       └── 📄 (To be created)
│
├── 📁 database/                      # Database related files
│   ├── 📄 schema.sql                 # Complete database schema
│   └── 📄 seeds.sql                  # Seed data for development
│
├── 📁 docs/                          # Documentation
│   ├── 📄 architecture.md            # System architecture documentation
│   ├── 📄 development.md             # Development guidelines
│   │
│   └── 📁 api/                       # API documentation
│       └── 📄 README.md              # API endpoint documentation
│
└── 📁 .cursor/                       # Cursor IDE configuration
    └── 📁 rules/
        ├── 📄 global.mdc             # Global development rules
        └── 📄 exhibitor.mdc          # Exhibitor-specific rules
```

## 📊 File Status

### ✅ Created Files
- Project documentation (README.md, PROJECT_STRUCTURE.md)
- Configuration files (package.json, tsconfig.json, .gitignore)
- Database schema and seeds
- Basic server setup (backend/src/server.ts)
- Database configuration (backend/src/config/database.ts)
- Socket.io configuration (backend/src/config/socket.io.ts)
- Frontend API service (frontend/src/services/api.ts)
- Frontend Socket service (frontend/src/services/socket.ts)
- TypeScript type definitions (frontend & backend)
- MVP component (BoothSelection.tsx)
- Documentation (architecture.md, development.md, api/README.md)

### 🚧 To Be Created
- Authentication system (routes, controllers, services, middleware)
- All API routes and controllers
- Database models
- React pages and components
- React hooks and context providers
- Payment integration (Stripe)
- Email service
- Testing setup
- Frontend App.tsx and routing

## 🎯 Next Steps

1. **Setup Development Environment**
   - Install dependencies (`npm install` in both frontend and backend)
   - Setup PostgreSQL database
   - Configure environment variables

2. **Implement Core Features**
   - Authentication system
   - Booth management API
   - Event management API
   - Payment processing

3. **Build Frontend**
   - Setup React Router
   - Create authentication pages
   - Build dashboard components
   - Integrate with API

4. **Testing & Deployment**
   - Write unit tests
   - Write integration tests
   - Setup CI/CD
   - Deploy to production

## 📝 Notes

- All TypeScript files use strict mode
- Database uses UUID for primary keys
- Real-time updates via Socket.io
- JWT for authentication
- Stripe for payment processing
- PostgreSQL for data persistence

