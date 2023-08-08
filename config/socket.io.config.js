const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Handle incoming socket connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for the "sendMessage" event
  socket.on('sendMessage', (data) => {
    console.log('Received message:', data);

    // Broadcast the received message to all connected clients
    io.emit('receiveMessage', data);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Socket.io server is running on port ${port}`);
});
