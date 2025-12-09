/**
 * WebSocket Handlers for Sales Module
 * 
 * Real-time booth availability updates via WebSocket
 */

import { Server as SocketIOServer } from 'socket.io';
import eventBus from '../../../core/event-bus';
import { featureFlags } from '../../../core/feature-flags';

export function setupSalesWebSocket(io: SocketIOServer): void {
  if (!featureFlags.enabled('realTimeUpdates')) {
    console.log('Real-time updates disabled');
    return;
  }

  // Listen for booth status changes
  eventBus.on('boothStatusChanged', (payload) => {
    // Broadcast to all clients in the event room
    if (payload.eventId) {
      io.to(`event:${payload.eventId}`).emit('boothStatusUpdate', {
        boothId: payload.boothId,
        status: payload.status,
        timestamp: new Date().toISOString()
      });
    }
  });

  // Socket connection handler
  io.on('connection', (socket) => {
    console.log('Sales WebSocket: Client connected', socket.id);

    // Join event room for real-time updates
    socket.on('join:event', (eventId: string) => {
      socket.join(`event:${eventId}`);
      console.log(`Sales WebSocket: Client ${socket.id} joined event:${eventId}`);
    });

    // Leave event room
    socket.on('leave:event', (eventId: string) => {
      socket.leave(`event:${eventId}`);
      console.log(`Sales WebSocket: Client ${socket.id} left event:${eventId}`);
    });

    // Handle booth selection
    socket.on('booth:select', async (data: { boothId: string; eventId: string }) => {
      // Emit event for other modules to handle
      await eventBus.emit('boothSelected', {
        boothId: data.boothId,
        eventId: data.eventId,
        socketId: socket.id,
        module: 'sales'
      });
    });

    // Disconnect handler
    socket.on('disconnect', () => {
      console.log('Sales WebSocket: Client disconnected', socket.id);
    });
  });

  console.log('✅ Sales WebSocket handlers registered');
}

