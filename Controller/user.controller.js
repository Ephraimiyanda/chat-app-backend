const bcrypt = require('bcrypt');
const userModel = require('../Models/user.model');
const messageModel = require('../Models/message.model');
const postModel = require("../")
const multer = require('multer');
const mongoose = require("mongoose")

const pictureSchema = new mongoose.Schema({
  filename: String,
  path: String,
});

const Picture = mongoose.model('Picture', pictureSchema);



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Set the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Set the filename for the uploaded file
  },
});

const upload = multer({ storage});

const registerUser = async (req, res) => {
  const { name, avatar, email, phoneNumber, DOB, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(402).json({ error: 'Email already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

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
    res.status(500).json({ error: 'An error occurred while registering user' });
  }
};

const loginUser = async (req, res) => {
  const heroName = req.body.heroName;
  const password = req.body.password;

  try {
    const user = await userModel.findOne({ name: heroName });
    if (!user) {
      res.status(402).json({ message: 'User does not exist' });
    } else {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        res.status(200).json({ message: 'Logged in successfully' });
      } else {
        res.status(402).json({ message: 'Invalid password' });
      }
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while logging in' });
  }
};

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

// Create a new post with image upload
const createPost = async (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
  
    const picture = new Picture({
      filename: req.file.filename,
      path: req.file.path,
    });
  
    picture.save()
      .then(() => res.json({ message: 'Picture uploaded successfully' }))
      .catch((err) => res.status(500).json({ error: 'Failed to upload picture', details: err }));
  
    try {
      const { sender, text } = req.body;

      // Get the filename of the uploaded image
      const content = req.file.filename;

      // Create a new post document with the image filename
      const newPost = new postModel({
        sender,
        text,
        content,
      });

      // Save the post to the database
      const savedPost = await newPost.save();

      res.status(201).json({ success: true, post: savedPost });
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ success: false, error: 'Failed to create the post' });
    }
  });
};

module.exports = {
  upload,
  createPost,
  registerUser,
  loginUser,
  getUserProfile,
  sendMessage,
  getUserMessages,
};
