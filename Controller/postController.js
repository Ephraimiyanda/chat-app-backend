
const userModel = require('./models/user.model');
const postModel = require('./models/post.model'); // Assuming you have a post model

// ... other functions ...

// Create a new post with image upload
const createPost = async (req, res) => {
  try {
    const { senderId, text } = req.body; // Assuming you get the senderId from the frontend

    // Check if the user exists before creating the post
    const user = await userModel.findById(senderId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get the Cloudinary URL of the uploaded image
    const content = req.file.path; // The Cloudinary URL is available in req.file.path

    // Create a new post document with the Cloudinary URL and user reference
    const newPost = new postModel({
      sender: senderId,
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
};

// ... other functions ...

module.exports = {
  upload,
  createPost,
  registerUser,
  loginUser,
  getUserProfile,
  sendMessage,
  getUserMessages,
  createPost,
};
