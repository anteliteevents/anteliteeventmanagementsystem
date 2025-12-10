"use strict";
/**
 * WebSocket Handlers for Sales Module
 *
 * Real-time booth availability updates via WebSocket
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSalesWebSocket = setupSalesWebSocket;
const event_bus_1 = __importDefault(require("../../../core/event-bus"));
const feature_flags_1 = require("../../../core/feature-flags");
function setupSalesWebSocket(io) {
    if (!feature_flags_1.featureFlags.enabled('realTimeUpdates')) {
        console.log('Real-time updates disabled');
        return;
    }
    // Listen for booth status changes
    event_bus_1.default.on('boothStatusChanged', (payload) => {
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
        socket.on('join:event', (eventId) => {
            socket.join(`event:${eventId}`);
            console.log(`Sales WebSocket: Client ${socket.id} joined event:${eventId}`);
        });
        // Leave event room
        socket.on('leave:event', (eventId) => {
            socket.leave(`event:${eventId}`);
            console.log(`Sales WebSocket: Client ${socket.id} left event:${eventId}`);
        });
        // Handle booth selection
        socket.on('booth:select', async (data) => {
            // Emit event for other modules to handle
            await event_bus_1.default.emit('boothSelected', {
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
//# sourceMappingURL=handlers.js.map