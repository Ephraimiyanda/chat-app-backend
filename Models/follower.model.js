const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const followerSchema = new Schema({
  user: {
    type: String,
    required: true
  },
  followers: [{
    type: Schema.Types.ObjectId,
    ref: 'users' // Reference to the same model (users collection)
  }],
  following: [{
    type: Schema.Types.ObjectId,
    ref: 'users' // Reference to the same model (users collection)
  }]
});


const FollowerModel = mongoose.model('followers', followerSchema);

module.exports = FollowerModel;
