const express = require('express');
const route = express.Router();
const controller = require('../Controller/user.controller');
const Multer = require('multer');

const storage = Multer.memoryStorage();
const upload = Multer({ storage });

route.get('/', (req, res) => {
  res.json('hello');
});

route.post('/register', controller.registerUser);
route.post('/login', controller.loginUser);

route.post('/create', upload.single('content'), async (req, res) => {
  try {
    const { sender, text } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Please upload an image' });
    }

    // Handle the image upload to Cloudinary
    const imageUrl = await handleUploadFile(req.file);

    // Create a new post document with the image URL
    const newPost = {
      sender,
      text,
      content: imageUrl,
    };

    // Call the createPost controller function to save the post to the database
    const createdPost = await controller.createPost(newPost);

    res.status(201).json({ success: true, post: createdPost });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ success: false, error: 'Failed to create the post' });
  }
});

module.exports = route;
