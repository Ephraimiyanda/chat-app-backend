const express = require('express')
const route = express.Router()
const controller = require('../Controller/user.controller')

route.get('/',(req,res)=>{
    res.json('hello')
})



route.post('/register',controller.registerUser);
route.post('/login',controller.loginUser);
route.post('/create',controller.createPost);
route.get('/allUsers',controller.allUsers);
route.get('/:userId', controller.getUserById);
route.get('/messages/:userId/:receiverId', controller.getUserMessages);
route.post('/messages', controller.sendMessage);
route.get('/post/allPosts',controller.allPosts);
route.get('/post/:postId',controller.getPostById);
route.get('/post/user/:senderId',controller.getPostBySenderId);
route.post('/follow/:userId/:followerId',controller.followUser);
route.post('/unfollow/:userId/:followerId',controller.unfollowUser);
route.get('/followers/:userId',controller.getFollowersByUserId);
route.get('/followers/users/:userId',controller.getFollowers);
route.get('/following/users/:userId',controller.getFollowing);
route.get('/statistics/:userId',controller.getUserStatistics);
route.post('/likePost/:postId',controller.likePost);
route.post('/unlikePost/:postId',controller.unlikePost);
route.get('/likedPosts/:PostId/:userId',controller.hasLikedPost);
route.get('/last-message-senders', getLastMessageSenders);
module.exports = route