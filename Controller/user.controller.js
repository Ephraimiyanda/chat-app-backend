const bcrypt = require("bcrypt");
const userModel = require("../Models/user.model");
const messageModel = require("../Models/message.model");
const postModel = require("../Models/post.model");
require("dotenv").config();
const cloudinary = require("../config/cloudinaryConfig");
const upload = require("../config/multerConfig");
const followerModel = require("../Models/follower.model");

const registerUser = async (req, res) => {
  const { name, avatar, email, phoneNumber, DOB, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(402).json({ error: "email already exists" });
    }

    // Hash the password before saving
    const saltGen = await bcrypt.genSalt(10);
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
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const loginUser = async (req, res) => {
  const heroName = req.body.heroName;
  const password = req.body.password;

  const user = await userModel.findOne({ name: heroName });
  if (!user) {
    res.status(402).json({ message: "user does not exist" });
  }
  res.status(200).json(user);
};

const getUserProfile = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Respond with the user's profile data
    res.status(200).json({ user });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching user profile" });
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
    const io = req.app.get("io"); // Get the io instance from the app
    io.emit("receiveMessage", newMessage);

    res
      .status(200)
      .json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "An error occurred" });
  }
}

const getUserMessages = async (req, res) => {
  const userId = req.params.userId;
  const receiverId = req.params.receiverId;
  try {
    // Fetch all messages where the user is either the sender or the receiver
    const messages = await messageModel.find({
      $or: [
        { sender: userId, receiver: receiverId },
        { sender: receiverId, receiver: userId },
      ],
    });

    // Respond with the messages
    res.status(200).json({ messages });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching user messages" });
  }
};

const allUsers = async (req, res) => {
  try {
    const getUsers = await userModel.find();
    res.json(getUsers);
  } catch (error) {
    console.log(error);
  }
};

const getUserById = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Respond with the user's data
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching user" });
  }
};

const createPost = async (req, res) => {
  try {
    const { text, content, sender, cloudinaryId } = req.body;

    const newPost = new postModel({
      sender,
      cloudinaryId,
      text,
      content,
    });
    await newPost.save();
    res.status(201).json({ success: true, post: await newPost.save() });
  } catch (error) {
    console.error("Error creating post:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to create the post" });
  }
};

const allPosts = async (req, res) => {
  try {
    const getPosts = await postModel.find();
    res.json(getPosts);
  } catch (error) {
    console.log(error);
  }
};

const getPostById = async (req, res) => {
  const postId = req.params.postId;

  try {
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "post not found" });
    }

    // Respond with the user's data
    res.status(200).json({ post });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching post" });
  }
};

const getPostBySenderId = async (req, res) => {
  const senderId = req.params.senderId;

  try {
    const posts = await postModel.find({ sender: senderId });

    if (!posts || posts.length === 0) {
      return res.status(404).json({ error: "Posts by sender not found" });
    }

    // Respond with the posts
    res.status(200).json({ posts });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching posts by sender" });
  }
};

const followUser = async (req, res) => {
  const followerId = req.body.followerId; // ID of the user who wants to follow
  const userId = req.params.userId; // ID of the user being followed

  try {
    // Find or create the follower model for the follower
    let followerUser = await followerModel.findOne({ user: followerId });
    if (!followerUser) {
      followerUser = new followerModel({ user: followerId });
      await followerUser.save();
    }

    // Find or create the follower model for the user being followed
    let userToFollow = await followerModel.findOne({ user: userId });
    if (!userToFollow) {
      userToFollow = new followerModel({ user: userId });
      await userToFollow.save();
    }

    // Check if the follower is already in the followers array
    if (userToFollow.followers.includes(followerId)) {
      return res.status(400).json({ error: "User is already following" });
    }

    // Update the followers and following arrays
    userToFollow.followers.push(followerId);
    followerUser.following.push(userId);

    // Save changes to both follower models
    await userToFollow.save();
    await followerUser.save();

    res.status(200).json({ message: "User followed successfully" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while following user" });
  }
};

const getFollowersByUserId = async (req, res) => {
  const userId = req.params.userId;

  try {
    const userFollowers = await followerModel.findOne({ user: userId });
    if (!userFollowers) {
      return res
        .status(404)
        .json({ error: "User not found or has no followers" });
    }

    // Respond with the user's followers
    res.status(200).json({ followers: userFollowers.following });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching user followers" });
  }
};

const unfollowUser = async (req, res) => {
  const followerId = req.body.followerId; // ID of the user who wants to unfollow
  const userId = req.params.userId; // ID of the user being unfollowed

  try {
    // Find the follower model for the follower
    const followerUser = await followerModel.findOne({ user: followerId });
    if (!followerUser) {
      return res.status(400).json({ error: "Follower not found" });
    }

    // Find the follower model for the user being unfollowed
    const userToUnfollow = await followerModel.findOne({ user: userId });
    if (!userToUnfollow) {
      return res.status(400).json({ error: "User to unfollow not found" });
    }

    // Check if the follower is in the followers array
    const followerIndex = userToUnfollow.followers.indexOf(followerId);
    if (followerIndex === -1) {
      return res.status(400).json({ error: "User is not following" });
    }

    // Remove the follower from the followers array
    userToUnfollow.followers.splice(followerIndex, 1);

    // Check if the user is in the following array of the follower
    const followingIndex = followerUser.following.indexOf(userId);
    if (followingIndex === -1) {
      return res
        .status(400)
        .json({ error: "Follower is not following the user" });
    }

    // Remove the user from the following array of the follower
    followerUser.following.splice(followingIndex, 1);

    // Save changes to both follower models
    await userToUnfollow.save();
    await followerUser.save();

    res.status(200).json({ message: "User unfollowed successfully" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while unfollowing user" });
  }
};

//get number of posts,followers and following
const getUserStatistics = async (req, res) => {
  const userId = req.params.userId;

  try {
    // Get user's post count
    const postCount = await postModel.countDocuments({ sender: userId });

    // Get user's followers count
    const userFollowers = await followerModel.findOne({ user: userId });
    const followersCount = userFollowers ? userFollowers.followers.length : 0;

    // Get user's following count
    const userFollowing = await followerModel.findOne({ user: userId });
    const followingCount = userFollowing ? userFollowing.following.length : 0;

    res.status(200).json({ postCount, followersCount, followingCount });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching user statistics" });
  }
};

//get user object of followers
const getFollowers = async (req, res) => {
  const userId = req.params.userId;

  try {
    const userFollowers = await followerModel.findOne({ user: userId });
    if (!userFollowers) {
      return res
        .status(404)
        .json({ error: "User not found or has no followers" });
    }

    const followerIds = userFollowers.followers;

    // Fetch user objects of followers
    const followers = await userModel.find({ _id: { $in: followerIds } });

    res.status(200).json({ followers });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching user followers" });
  }
};

//get user object of following
const getFollowing = async (req, res) => {
  const userId = req.params.userId;

  try {
    const userFollowing = await followerModel.findOne({ user: userId });
    if (!userFollowing) {
      return res
        .status(404)
        .json({ error: "User not found or is not following anyone" });
    }

    const followingIds = userFollowing.following;

    // Fetch user objects of following
    const following = await userModel.find({ _id: { $in: followingIds } });

    res.status(200).json({ following });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching user following" });
  }
};

const likePost = async (req, res) => {
  const postId = req.params.postId;
  const userId = req.body.userId; // Assuming you have user authentication in place

  try {
    // Find the post by ID
    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the user has already liked the post
    if (post.likes.includes(userId)) {
      return res
        .status(400)
        .json({ error: "You have already liked this post" });
    }

    // Add the user's ID to the likes array
    post.likes.push(userId);

    // Save the post to update the likes
    await post.save();

    res.status(200).json({ message: "Post liked successfully" });
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ error: "An error occurred while liking the post" });
  }
};
const unlikePost = async (req, res) => {
  const postId = req.params.postId;
  const userId = req.body.userId; // Assuming you have user authentication in place

  try {
    // Find the post by ID
    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the user has already liked the post
    if (!post.likes.includes(userId)) {
      return res.status(400).json({ error: "You have not liked this post" });
    }

    // Remove the user's ID from the likes array
    const likeIndex = post.likes.indexOf(userId);
    post.likes.splice(likeIndex, 1);

    // Save the post to update the likes
    await post.save();

    res.status(200).json({ message: "Post unliked successfully" });
  } catch (error) {
    console.error("Error unliking post:", error);
    res
      .status(500)
      .json({ error: "An error occurred while unliking the post" });
  }
};

const hasLikedPost = async (req, res) => {
  const postId = req.params.postId;
  const userId = req.params.userId; // Assuming you have user authentication in place

  try {
    // Find the post by ID
    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the user has already liked the post
    const hasLiked = post.likes.includes(userId);

    res.status(200).json({ hasLiked });
  } catch (error) {
    console.error("Error checking if user has liked post:", error);
    res
      .status(500)
      .json({
        error: "An error occurred while checking if user has liked the post",
      });
  }
};

const getLastMessageSenders = async (req, res) => {
  const userId = req.params.userId; // Get the user's ID

  try {
    const lastMessageSenders = await messageModel
      .find({ receiver: userId })
      .sort({ createdAt: -1 }) // Sort messages in descending order of creation
      .limit(5) // Get the last 5 senders

    const senderIds = [...new Set(lastMessageSenders.map(message => message.sender))]; // Unique sender IDs

    // Fetch user objects of senders
    const senders = await userModel.find({ _id: { $in: senderIds } });

    res.status(200).json({ senders });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching last message senders' });
  }
};
const search = async (req, res) => {
  const { searchQuery, searchType } = req.query;

  if (!searchQuery || !searchType) {
    return res.status(400).json({ error: "Invalid search parameters" });
  }

  try {
    if (searchType === "accounts") {
      // Search for accounts based on the username
      const accounts = await userModel.find({ name: { $regex: searchQuery, $options: "i" } });
      res.status(200).json({ results: accounts });
    } else if (searchType === "posts") {
      // Search for posts based on their content
      const posts = await postModel.find({ text: { $regex: searchQuery, $options: "i" } });
      res.status(200).json({ results: posts });
    } else {
      res.status(400).json({ error: "Invalid search type" });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred while searching" });
  }
};

module.exports = {
  upload,
  getFollowers,
  getFollowing,
  getUserStatistics,
  unfollowUser,
  followUser,
  getFollowersByUserId,
  getUserById,
  getPostBySenderId,
  getPostById,
  createPost,
  registerUser,
  loginUser,
  getUserProfile,
  sendMessage,
  getUserMessages,
  createPost,
  allUsers,
  allPosts,
  likePost,
  unlikePost,
  hasLikedPost,
  getLastMessageSenders,
  search
};
