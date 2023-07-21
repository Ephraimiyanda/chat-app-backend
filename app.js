require('dotenv').config()
const express = require('express');
const CoRs = require('cors')
const app  = express()
app.use(CoRs())
const port = process.env.PORT || 2000
const body_parser = require('body-parser')
const userRoute = require('./Route/user.route')


app.listen(port,()=>{
    console.log(`app listening @ port ${port}`);
})
const Db = require('./config/db')
Db()
app.use(body_parser.urlencoded({extended:true}))
app.use(body_parser.json())

app.use('/user', userRoute)
