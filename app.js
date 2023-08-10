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
const server = http.createServer(app);
const socketIO = require('socket.io')(http,{
  cors:{
    origin:"http://localhost:3000"
  }
});
const io = setupSocket(server);
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

// Start the server
server.listen(port, () => {
  socketIO.on("connection",function(socket){
    console.log("user connected:"-socket.id);
  })
  console.log(`App listening at port ${port}`);
});

// Set up Socket.io using the setupSocket function

