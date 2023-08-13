require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Socket = require('./config/socket.io.config'); 
const socketIo = require('socket.io');// Import the setupSocket function
const Db = require('./config/db');
const userRoute = require('./Route/user.route'); // Update path to your route file
const app = express();
const http = require('http')
const port = process.env.PORT || 2000;
const server = http.createServer(app);
const io = Socket(server);
// Connect to the database
Db();

const corsOptions = {
  origin: "*",
  methods: ['GET', 'POST'],
  credentials: true, // Allow cookies to be sent with the request
};

app.use(cors(corsOptions));
 // Enable Cross-Origin Resource Sharing

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use('/user', userRoute);

server.listen(port, () => {
  console.log(`App listening at port ${port}`);
});

// Set up Socket.io using the setupSocket function

