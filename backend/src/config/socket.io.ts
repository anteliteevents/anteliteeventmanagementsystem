import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';

let io: Server;

export const setupSocketIO = (httpServer: HTTPServer): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Join event room for real-time updates
    socket.on('join-event', (eventId: string) => {
      socket.join(`event:${eventId}`);
      console.log(`📡 Socket ${socket.id} joined event:${eventId}`);
    });

    // Leave event room
    socket.on('leave-event', (eventId: string) => {
      socket.leave(`event:${eventId}`);
      console.log(`📡 Socket ${socket.id} left event:${eventId}`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.io not initialized. Call setupSocketIO first.');
  }
  return io;
};
