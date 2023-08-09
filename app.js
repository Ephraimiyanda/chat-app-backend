require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const setupSocket = require('./config/socket.io.config'); // Import the setupSocket function
const Db = require('./config/db');
const userRoute = require('./routes/user.route'); // Update path to your route file
const app = express();
const port = process.env.PORT || 2000;
const server = http.createServer(app);
const socketIO = require('socket.io');
const io = socketIO(server);
// Connect to the database
Db();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use('/user', userRoute);
setupSocket(io)
// Start the server
server.listen(port, () => {
  console.log(`App listening at port ${port}`);
});

// Set up Socket.io using the setupSocket function

