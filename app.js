const express = require('express');
const route = express.Router();
const controller = require('./Controller/user.controller');
const Multer = require('multer');

const storage = Multer.memoryStorage();
const upload = Multer({ storage });

route.get('/', (req, res) => {
  res.json('hello');
});

route.post('/register', controller.registerUser);
route.post('/login', controller.loginUser);

route.post('/create', upload.single('content'),controller.createPost);
module.exports = route;
