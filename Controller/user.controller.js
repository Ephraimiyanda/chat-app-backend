const bcrypt = require('bcrypt');
require("dotenv").config();
const userModel = require('../Models/user.model');
const messageModel = require('../Models/message.model');
const cloudinary = require("cloudinary").v2;
const cors = require("cors");
const Multer = require("multer");
const express=require("express");
const app  = express();

cloudinary.config({
  cloud_name: process.env.dg0kdnwt1,
  api_key: 743174149656362,
  api_secret: process.env.NT0lp3G44g26b2jYH8BX5Ju0UsY,
});


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
     res.status(200).json({message:"logged in successfuly"})
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

const sendMessage = async (req, res) => {
  const { senderId, receiverId, content } = req.body;

  try {
    // Check if both sender and receiver exist
    const sender = await userModel.findById(senderId);
    const receiver = await userModel.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({ error: 'Sender or receiver not found' });
    }

    // Create a new message instance
    const newMessage = new messageModel({
      sender: senderId,
      receiver: receiverId,
      content,
    });

    // Save the message to the database
    await newMessage.save();

    // Respond with success message
    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while sending the message' });
  }
};

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

const storage = new Multer.memoryStorage();
const upload = Multer({
  storage,
});

async function handleUpload(file) {
  const res = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });
  return res;
}


app.use(cors());

app.get('/', function(req, res) {
    res.send('Hi')
})

app.post("/upload", upload.single("my_file"), async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    const cldRes = await handleUpload(dataURI);
    res.json(cldRes);
  } catch (error) {
    console.log(error);
    res.send({
      message: error.message,
    });
  }
});

// ... The rest of your code

// Handle file upload to Cloudinary
async function handleUploadFile(file) {
  try {
    const b64 = Buffer.from(file.buffer).toString("base64");
    let dataURI = "data:" + file.mimetype + ";base64," + b64;
    const cldRes = await handleUpload(dataURI);
    return cldRes.secure_url;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to upload file");
  }
}

// Create a new post with image upload using Cloudinary
const createPost = async (req, res) => {
  try {
    const { sender, text } = req.body;

    // Get the image URL from Cloudinary
    const imageUrl = await handleUploadFile(req.file);

    // Create a new post document with the image URL
    const newPost = new postModel({
      sender,
      text,
      content: imageUrl,
    });

    // Save the post to the database
    const savedPost = await newPost.save();

    res.status(201).json({ success: true, post: savedPost });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ success: false, error: 'Failed to create the post' });
  }
};






module.exports = { upload,createPost, registerUser,loginUser, getUserProfile, sendMessage, getUserMessages, createPost };
