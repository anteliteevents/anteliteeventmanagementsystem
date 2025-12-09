"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.setupSocketIO = void 0;
const socket_io_1 = require("socket.io");
let io;
const setupSocketIO = (httpServer) => {
    io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });
    io.on('connection', (socket) => {
        console.log(`🔌 Client connected: ${socket.id}`);
        // Join event room for real-time updates
        socket.on('join-event', (eventId) => {
            socket.join(`event:${eventId}`);
            console.log(`📡 Socket ${socket.id} joined event:${eventId}`);
        });
        // Leave event room
        socket.on('leave-event', (eventId) => {
            socket.leave(`event:${eventId}`);
            console.log(`📡 Socket ${socket.id} left event:${eventId}`);
        });
        socket.on('disconnect', () => {
            console.log(`🔌 Client disconnected: ${socket.id}`);
        });
    });
    return io;
};
exports.setupSocketIO = setupSocketIO;
const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized. Call setupSocketIO first.');
    }
    return io;
};
exports.getIO = getIO;
//# sourceMappingURL=socket.io.js.map