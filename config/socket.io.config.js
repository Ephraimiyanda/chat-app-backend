const socketIO = require('socket.io');
const MessageModel = require('../Models/message.model');
const http = require('http');

function setupSocket(server) {
  const io =new socketIO(http, {
    cors: {
      origin: 'http://localhost:3000', // Change this to your frontend's URL
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected');

    // Listen for the 'sendMessage' event
    socket.on('sendMessage', async (message) => {
      try {
        // Handle the received message, process, and save it to the database
        const newMessage = new MessageModel({
          sender: message.senderId,
          receiver: message.receiverId,
          content: message.content,
        });

        await newMessage.save(); // Make sure to use await here

        // Emit the message to other clients
        io.emit('receiveMessage', newMessage);
      } catch (error) {
        console.error('Error handling and emitting message:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });

  return io;
}

module.exports = setupSocket;
