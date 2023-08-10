const socketIO = require('socket.io');
const MessageModel = require('../Models/message.model');
const cors = require('cors');
function setupSocket(server) {
  const io = socketIO(server);
  const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true, // Allow cookies to be sent with the request
  };
  
  io.use(cors(corsOptions))
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
