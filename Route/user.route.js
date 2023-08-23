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
route.post('/messages/:userId/:receiverId', controller.getUserMessages);
route.post('/messages', controller.sendMessage);
route.get('/:userId', controller.getUserById);
route.get('/allPosts',controller.allPosts);
route.get('/post/:postId',controller.getPostById);
route.get('/post/:senderId',controller.getPostBySenderId);
module.exports = route