# Modular Architecture Documentation

## 🏗️ Architecture Overview

This system follows a **strict modular architecture** with event-driven communication, feature flags, and auto-discovery.

---

## 📁 Folder Structure

```
src/
├── core/           # Shared core systems only
│   ├── event-bus.ts      # Event bus for module communication
│   ├── feature-flags.ts  # Feature flag system
│   ├── module-loader.ts  # Auto-discovery and registration
│   ├── database.ts       # Shared database connection
│   ├── auth.ts           # Shared authentication
│   └── utils.ts          # Shared utilities
│
├── modules/        # Feature modules (isolated)
│   ├── sales/      # Sales management
│   ├── costing/    # Cost tracking
│   ├── proposals/  # Proposal management
│   ├── monitoring/ # Team monitoring
│   ├── policies/   # Policy management
│   ├── payments/   # Payment integration
│   └── new-feature/ # Placeholder
│
├── plugins/        # External integrations
│
└── api/            # API Gateway
    └── gateway.ts  # Single entry point
```

---

## 🔑 Core Principles

### 1. **No Direct Module-to-Module Calls**
❌ **WRONG:**
```typescript
// In sales module
import { paymentService } from '../payments/services/payment.service';
paymentService.processPayment();
```

✅ **CORRECT:**
```typescript
// In sales module
await eventBus.emit('boothBooked', { boothId, eventId, exhibitorId });

// In payments module
eventBus.on('boothBooked', async (payload) => {
  await paymentService.processPayment(payload);
});
```

### 2. **All Communication via Event Bus**
- Modules emit events
- Other modules listen and respond
- No tight coupling

### 3. **Feature Flags for Everything**
```typescript
if (!featureFlags.enabled('sales')) {
  return res.status(503).json({ error: 'Module disabled' });
}
```

### 4. **Module Auto-Discovery**
- Each module has `module.json`
- System automatically discovers and loads modules
- Routes, events, migrations auto-registered

### 5. **Single API Gateway**
- All routes go through `/api/{module-name}/*`
- Prevents route collisions
- Unified error handling

---

## 📦 Module Structure

Each module must have:

```
modules/sales/
├── module.json          # Metadata (required)
├── index.ts            # Module entry point (required)
├── routes/
│   └── index.ts        # API routes
├── services/           # Business logic
│   ├── sales.service.ts
│   └── floor-plan.service.ts
├── models/            # Data models (optional)
├── migrations/        # DB migrations (optional)
└── websocket/        # WebSocket handlers (optional)
    └── handlers.ts
```

---

## 📄 module.json Format

```json
{
  "name": "sales",
  "version": "1.0.0",
  "description": "Sales management module",
  "events": ["boothBooked", "boothReserved"],
  "dbTables": ["booths", "reservations"],
  "apiRoutes": ["/api/sales/*"],
  "dependencies": ["authentication", "database"]
}
```

---

## 🔔 Event Bus Usage

### Emitting Events
```typescript
import eventBus from '../../core/event-bus';

await eventBus.emit('boothBooked', {
  boothId: '123',
  eventId: '456',
  exhibitorId: '789',
  module: 'sales'
});
```

### Listening to Events
```typescript
// In module index.ts
eventHandlers: {
  'boothBooked': async (payload) => {
    // Handle the event
    console.log('Booth booked:', payload);
  }
}
```

---

## 🚩 Feature Flags

### Check if Enabled
```typescript
import { featureFlags } from '../../core/feature-flags';

if (!featureFlags.enabled('sales')) {
  throw new Error('Sales module is disabled');
}
```

### Enable/Disable
```typescript
featureFlags.enable('newFeature');
featureFlags.disable('oldFeature');
```

---

## 🌐 API Gateway

All module routes are automatically registered at:
```
/api/{module-name}/*
```

Example:
- Sales module: `/api/sales/booths/available`
- Payments module: `/api/payments/process`
- Costing module: `/api/costing/costs`

---

## 🎯 Sales Module Features

### Interactive SVG Floor Plan
- Drag-drop booth selection
- Real-time availability updates
- Visual status indicators
- Click to select, double-click to book

### Real-time Updates
- WebSocket integration
- Live booth status changes
- Automatic UI updates

### Events Emitted
- `boothBooked` - When a booth is booked
- `boothReserved` - When a booth is reserved
- `boothReleased` - When a booth is released
- `boothStatusChanged` - When status changes

---

## 🛡️ Crash Prevention Rules

1. ✅ **No direct imports between modules**
2. ✅ **All communication via event bus**
3. ✅ **Feature flags wrap new code**
4. ✅ **Single API gateway prevents collisions**
5. ✅ **Each module manages own migrations**
6. ✅ **Shared data via events or shared DB schema**

---

## 📚 Adding a New Module

1. Create folder: `modules/my-module/`
2. Add `module.json` with metadata
3. Create `index.ts` with module config
4. Add routes, services, etc.
5. System auto-discovers and loads it!

---

## 🔍 Module Discovery

The system automatically:
- Scans `modules/` folder
- Finds `module.json` files
- Loads modules in dependency order
- Registers routes and event handlers
- Runs migrations
- Initializes modules

---

## 🚀 Benefits

✅ **Scalable** - Add modules without touching existing code  
✅ **Maintainable** - Clear boundaries, no spaghetti code  
✅ **Testable** - Modules can be tested in isolation  
✅ **Flexible** - Enable/disable features dynamically  
✅ **Safe** - Crash prevention rules enforced  
✅ **Modern** - Event-driven, real-time, modular  

---

## 📖 Next Steps

1. Explore the sales module implementation
2. Add features to existing modules
3. Create new modules following the pattern
4. Use feature flags to control rollout

