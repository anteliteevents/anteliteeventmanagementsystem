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

// Modular Architecture Imports
import { moduleLoader } from './core/module-loader';
import { apiGateway } from './api/gateway';
import { featureFlags } from './core/feature-flags';
import { setupSalesWebSocket } from './modules/sales/websocket/handlers';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
const io = setupSocketIO(httpServer);

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

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

