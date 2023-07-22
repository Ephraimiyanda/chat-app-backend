const express = require('express')
const route = express.Router()
const controller = require('../Controller/user.controller')
const upload = require("../config/multerConfig");

route.get('/',(req,res)=>{
    res.json('hello')
})



route.post('/register',controller.registerUser);
route.post('/login',controller.loginUser);
route.post('/create', upload.single("image"),controller.createPost);

module.exports = route