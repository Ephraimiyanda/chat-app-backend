const express = require('express')
const route = express.Router()
const controller = require('../Controller/user.controller')
const upload = require("../config/multerConfig");

route.get('/',(req,res)=>{
    res.json('hello')
})



route.post('/register',controller.registerUser);
route.post('/login',controller.loginUser);
route.post('/create',controller.createPost);
route.post('/upload', upload.any(),controller.createPost);

module.exports = route