const bcrypt = require('bcrypt');
const userModel = require('../Models/user.model');
const messageModel = require('../Models/message.model');
const postModel = require("../Models/post.model");
require("dotenv").config();
const cloudinary = require("../config/cloudinaryConfig");
const upload = require("../config/multerConfig");
const http = require('http');
const socketIO = require('socket.io');
const express = require('express');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);


const registerUser = async (req, res) => {
  const { name, avatar, email, phoneNumber, DOB, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(402).json({ error: 'email already exists' });
    }

    // Hash the password before saving
    const saltGen = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, saltGen);

    // Create a new user instance
    const newUser = new userModel({
      name,
      avatar,
      email,
      phoneNumber,
      DOB,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    // Respond with success message
    res.status(200).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const loginUser = async(req,res)=>{
    const heroName = req.body.heroName
    const password = req.body.password

     const user = await userModel.findOne({name:heroName})
     if(!user){
        res.status(402).json({message:"user does not exist"})
     }
     res.status(200).json(user)
}




const getUserProfile = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Respond with the user's profile data
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching user profile' });
  }
};

const getUserById = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Respond with the user's data
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching user' });
  }
};
const sendMessage = async (senderId, receiverId, content) => {
  const message = new messageModel({ sender: senderId, receiver: receiverId, content });

  try {
    await message.save();
    io.emit('receiveMessage', message);
  } catch (error) {
    console.error('Error saving message:', error);
  }
};

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('sendMessage', async (data) => {
    const { senderId, receiverId, content } = data;
    sendMessage(senderId, receiverId, content);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});



const getUserMessages = async (req, res) => {
  const userId = req.params.userId;

  try {
    // Fetch all messages where the user is either the sender or the receiver
    const messages = await messageModel.find({
      $or: [{ sender: userId }, { receiver: userId }],
    });

    // Respond with the messages
    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching user messages' });
  }
};

const allUsers =  async(req,res)=>{
  try {
    const getUsers = await userModel.find()
    res.json(getUsers)
    
  } catch (error) {
    console.log(error);
  }
}


const createPost = async (req, res) => {
  
  try {
    const { text,content,sender,cloudinaryId} = req.body;

    const newPost = new postModel({
      sender,
      cloudinaryId,
      text,
      content
    });
    await newPost.save();
    res.status(201).json({ success: true, post: await newPost.save()});
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ success: false, error: 'Failed to create the post' });
  }
};




module.exports = { upload , createPost, registerUser,loginUser, getUserProfile, sendMessage, getUserMessages, createPost, allUsers,getUserById };
