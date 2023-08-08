const mongoose = require('mongoose')
const Schema = mongoose.Schema

const registerSchema = new Schema({
    user:{
       type:String,
       required:true 
    },
    followers
})

const RegisterMOdel = mongoose.model('users',registerSchema)

module.exports =   RegisterMOdel