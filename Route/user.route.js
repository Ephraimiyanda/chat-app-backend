const express = require('express')
const route = express.Router()
const controller = require('../Controller/user.controller')

route.get('/',(req,res)=>{
    res.json('hello')
})



route.post('/register',controller.registerUser);
route.post('/login',controller.loginUser);
route.post('/create',controller.createPost);
route.get('/allUsers',controller.allUsers)
route.get('/messages/:userId', controller.getUserMessages);
route.post('/messages/send', controller.sendMessage);
route.get('/:userId', controller.getUserById)
module.exports = route