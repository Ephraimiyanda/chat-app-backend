const bcrypt = require('bcrypt');
const userModel = require('../Models/user.model');
const messageModel = require('../Models/message.model');
const postModel =require("../Models/post.model")
require("dotenv").config();
const express = require("express");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");
const Multer = require("multer");
const app=express();
const cloud = require("../config/cloudinaryConfig")


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


// Create a new post with image upload using Cloudinary
module.exports = {
  createImage: (req, res) => {
    let imageDetails = {
      imageName: req.files[0].originalname,
    };
    //USING MONGODB QUERY METHOD TO FIND IF IMAGE-NAME EXIST IN THE DB
    postModel.find({ content: imageDetails.imageName }, (err, callback) => {
      //CHECKING IF ERROR OCCURRED.
      if (err) {
        res.json({
          err: err,
          message: `There was a problem creating the image because: ${err.message}`,
        });
      } else {
        let attempt = {
          content: req.files[0].path,
          text
        };
        cloud.uploads(attempt.content).then((result) => {
          let imageDetails = {
            content: result.url,
            text
          };
          // Create image in the database
          postModel
            .create(imageDetails)
            .then((image) => {
              res.json({
                success: true,
                data: image,
              });
            })
            .catch((error) => {
              res.json({
                success: false,
                message: `Error creating image in the database: ${error.message}`,
              });
            });
        });
      }
    });
  },
}


module.exports = { createPost, registerUser,loginUser, getUserProfile, sendMessage, getUserMessages, createPost };
