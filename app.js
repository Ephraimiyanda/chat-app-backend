require('dotenv').config()
const express = require('express');
const CoRs = require('cors')
const app  = express()
app.use(CoRs())
const port = process.env.PORT || 2000
const body_parser = require('body-parser')
const userRoute = require('./Route/user.route')
const upload = require('./config/cloudinaryConfig');

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
      // The uploaded file details are available in req.file
      const { originalname, mimetype, size, secure_url } = req.file;
  
      // Your code to handle the uploaded file goes here
      // For example, you can save the file details to a database, send a response, etc.
  
      res.json({ message: 'File uploaded successfully', fileUrl: secure_url });
    } catch (error) {
      console.error('Error handling file upload:', error);
      res.status(500).json({ success: false, error: 'Failed to handle file upload' });
    }
  });
  
app.listen(port,()=>{
    console.log(`app listening @ port ${port}`);
})
const Db = require('./config/db')
Db()
app.use(body_parser.urlencoded({extended:true}))
app.use(body_parser.json())

app.use('/user', userRoute)