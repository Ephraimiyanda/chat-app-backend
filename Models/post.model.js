const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
      },
      text:{
        type:String,
        require:true
      },
      content:{
        type:String,
        require:true
      }
});


const postModel = mongoose.model('posts',postSchema)
module.exports = postModel