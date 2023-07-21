const mongoose = require('mongoose')
const Schema = mongoose.Schema

const registerSchema = new Schema({
    heroName:{
       type:String,
       required:true 
    },
    avatar:{
        type:String
    },
    dateJoined:{
        type:Date,
        default:Date.now
    },
    email:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:String
    },
    DOB:{
        type:String, 
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const RegisterMOdel = mongoose.model('users',registerSchema)

module.exports =   RegisterMOdel