import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { setupSocketIO } from './config/socket.io';
import boothSalesRoutes from './routes/boothSales.routes';
import boothsRoutes from './routes/booths.routes';
import stripeWebhookRoutes from './routes/stripeWebhook.routes';
import eventRoutes from './routes/event.routes';
import authRoutes from './routes/auth.routes';
import usersRoutes from './routes/users.routes';
import paymentsRoutes from './routes/payments.routes';

// Modular Architecture Imports
import { moduleLoader } from './core/module-loader';
import { apiGateway } from './api/gateway';
import { featureFlags } from './core/feature-flags';
import { setupSalesWebSocket } from './modules/sales/websocket/handlers';
import { defaultAllowedOrigins } from './config/customOrigins';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
const io = setupSocketIO(httpServer);

// Middleware
const allowedOrigins = (process.env.CORS_ORIGIN || defaultAllowedOrigins.join(','))
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

app.use((req, res, next) => {
  const origin = req.header('Origin');
  const isAllowed = !origin || allowedOrigins.includes(origin);

  if (isAllowed) {
    res.header('Access-Control-Allow-Origin', origin || allowedOrigins[0]);
    res.header('Vary', 'Origin');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.header(
      'Access-Control-Allow-Headers',
      req.header('Access-Control-Request-Headers') ||
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    return next();
  }

  return res.status(403).send('CORS Forbidden');
});

app.use(helmet());

// Stripe webhook route - must be before express.json() to receive raw body
app.use('/api/webhooks', express.raw({ type: 'application/json' }), stripeWebhookRoutes);

// Parse JSON for all other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    modules: Array.from(moduleLoader.getModules().keys()),
    featureFlags: featureFlags.getAllFlags().filter(f => f.enabled).map(f => f.name)
  });
});

// Legacy API Routes (for backward compatibility)
app.use('/api/auth', authRoutes);
app.use('/api/booths', boothSalesRoutes); // Sales operations
app.use('/api/admin/booths', boothsRoutes); // CRUD operations
app.use('/api/events', eventRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/invoices', invoicesRoutes);
app.use('/api/reservations', reservationsRoutes);
import invoicesRoutes from './routes/invoices.routes';
import reservationsRoutes from './routes/reservations.routes';

// Initialize Modular Architecture
async function initializeModules() {
  try {
    console.log('\n🔧 Initializing Modular Architecture...\n');
    
    // Load all modules
    await moduleLoader.loadAllModules();
    
    // Register module routes via API Gateway
    apiGateway.initialize(app, '/api');
    
    // Setup WebSocket handlers for modules
    if (featureFlags.enabled('realTimeUpdates')) {
      setupSalesWebSocket(io);
    }
    
    console.log('\n✅ Modular Architecture Initialized!\n');
  } catch (error) {
    console.error('❌ Error initializing modules:', error);
    process.exit(1);
  }
}

// Error handling middleware (to be implemented)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'Internal server error'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found'
    }
  });
});

const PORT = process.env.PORT || 3001;

// Initialize modules and start server
initializeModules().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`📡 Socket.io server initialized`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`\n📋 Available Modules:`);
    moduleLoader.getModules().forEach((module, name) => {
      console.log(`   ✅ ${name} v${module.metadata.version}`);
    });
    console.log(`\n🔗 API Gateway: http://localhost:${PORT}/api`);
    console.log(`📊 Health Check: http://localhost:${PORT}/health\n`);
  });
}).catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await moduleLoader.shutdown();
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Make io available globally (for use in routes)
export { io };

