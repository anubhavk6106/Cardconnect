const socketIO = require('socket.io');

let io;
const userSockets = new Map(); // userId -> socketId mapping

const initializeSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL ,
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // User registers their socket
    socket.on('register', (userId) => {
      userSockets.set(userId, socket.id);
      console.log(`User ${userId} registered with socket ${socket.id}`);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      // Remove user from map
      for (let [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(userId);
          console.log(`User ${userId} disconnected`);
          break;
        }
      }
    });
  });

  return io;
};

// Send notification to specific user
const sendNotificationToUser = (userId, event, data) => {
  const socketId = userSockets.get(userId.toString());
  if (socketId && io) {
    io.to(socketId).emit(event, data);
    console.log(`Notification sent to user ${userId}:`, event);
  }
};

// Broadcast to all connected clients
const broadcastNotification = (event, data) => {
  if (io) {
    io.emit(event, data);
  }
};

module.exports = {
  initializeSocket,
  sendNotificationToUser,
  broadcastNotification
};
