require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const setupSocket = require('./config/socket.io.config'); // Import the setupSocket function
const Db = require('./config/db');
const userRoute = require('./Route/user.route'); // Update path to your route file
const app = express();
const http = require('http')
const port = process.env.PORT || 2000;
const server = http.createServer(app)
const MessageModel =require('./Models/message.model');
const socket = require('socket.io')(http,{
  cors:{
    origin:"http://localhost:3000"
  }
});
// Connect to the database
Db();

// Middleware
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true, // Allow cookies to be sent with the request
};

app.use(cors(corsOptions));
 // Enable Cross-Origin Resource Sharing

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use('/user', userRoute);
socket.on("connection",(socket)=>{
  
    // Listen for the 'sendMessage' event
    socket.on('sendMessage', async (message) => {
      try {
        // Handle the received message, process, and save it to the database
        const newMessage  = new MessageModel({
          sender: message.senderId,
          receiver: message.receiverId,
          content: message.content,
        });
        newMessage.save()
        // Save the message to the database using your messageModel or any other method

        // Emit the message to other clients
        io.to(message.receiverId).emit('receiveMessage', message.receiverId);
      } catch (error) {
        console.error('Error handling and emitting message:', error);
      }
    });

  socket.on("disconnect", ()=>{
    console.log("Disconnected")
  })
})
// Start the server
server.listen(port, () => {
  console.log(`App listening at port ${port}`);
});

// Set up Socket.io using the setupSocket function

