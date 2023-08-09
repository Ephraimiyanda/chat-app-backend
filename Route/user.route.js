const express = require('express')
const route = express.Router()
const controller = require('../Controller/user.controller')
const cors = require('cors');

route.use(cors());
route.get('/',(req,res)=>{
    res.json('hello')
})


route.post('/register',controller.registerUser);
route.post('/login',controller.loginUser);
route.post('/create',controller.createPost);
route.get('/allUsers',controller.allUsers)
route.get('/:userId', controller.getUserById);
route.get('/messages/:userId', cors(), controller.getUserMessages);
route.post('/messages/send', cors(), controller.sendMessage);

module.exports = route