const socketIO = require('socket.io');
const MessageModel = require('../Models/message.model');

function setupSocket(server) {
  const io = socketIO(server, {
    cors: {
      origin: "*"
    }
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
        await newMessage.save();

        // Emit the message to the sender
        socket.emit(`sender-${message.senderId}`, newMessage);

       io.to(socket.id).emit(`receive-${message.receiverId}`, newMessage);
        
        
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
