const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
      },
      cloudinaryId:{
        type:String,
        require:true,
      },
      text:{
        type:String,
      },
      content:{
        type:String,
        require:true
      },
      dateJoined:{
        type:Date,
        default:Date.now
    },
});


const postModel = mongoose.model('posts',postSchema)
module.exports = postModel