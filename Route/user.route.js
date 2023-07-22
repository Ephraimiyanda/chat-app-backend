const express = require('express')
const route = express.Router()
const controller = require('../Controller/user.controller')
const Multer = require("multer");


route.get('/',(req,res)=>{
    res.json('hello')
})

const storage = new Multer.memoryStorage();
const upload = Multer({
  storage,
});

route.post('/register',controller.registerUser);
route.post('/login',controller.loginUser);
route.post('/create',controller.createPost);
route.post('/upload', upload.single('image'),controller.createPost);

module.exports = route