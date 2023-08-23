const bcrypt = require('bcrypt');
const userModel = require('../Models/user.model');
const messageModel = require('../Models/message.model');
const postModel = require("../Models/post.model");
require("dotenv").config();
const cloudinary = require("../config/cloudinaryConfig");
const upload = require("../config/multerConfig");



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
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Respond with the user's profile data
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching user profile' });
  }
};

async function sendMessage(req, res) {
  try {
    // Extract data from request body
    const { senderId, receiverId, content } = req.body;

    // Create and save the message to the database
    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      content: content,
    });
    await newMessage.save();

    // Emit the message to the receiver using Socket.io
    const io = req.app.get('io'); // Get the io instance from the app
    io.emit('receiveMessage', newMessage);

    res.status(200).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}

const getUserMessages = async (req, res) => {
  const userId = req.params.userId;
  const receiverId=req.params.receiverId
  try {
    // Fetch all messages where the user is either the sender or the receiver
    const messages = await messageModel.find({
      $or: [{ sender: userId }, { receiver:receiverId }],
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

const allPosts =  async(req,res)=>{
  try {
    const getPosts = await postModel.find()
    res.json(getPosts)
    
  } catch (error) {
    console.log(error);
  }
}

const getPostById = async (req, res) => {
  const postId = req.params.postId;

  try {
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'post not found' });
    }

    // Respond with the user's data
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching post' });
  }
};

const getPostBySenderId = async (req, res) => {
  const senderId= req.params.senderId;

  try {
    const sender = await postModel.findById(senderId);
    if (!sender) {
      return res.status(404).json({ error: 'post of sender not found' });
    }

    // Respond with the user's data
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching post' });
  }
};
module.exports = { upload, getUserById ,getPostBySenderId,getPostById, createPost, registerUser,loginUser, getUserProfile, sendMessage, getUserMessages, createPost, allUsers,allPosts };
