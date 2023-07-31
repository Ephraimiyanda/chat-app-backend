const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const registerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: function () {
      return "https://th.bing.com/th/id/R.24b823241775b806d626d4a624f03dbf?rik=noe3cJUJEyhJjw&riu=http%3a%2f%2fwww.mrctemiscamingue.org%2fwp-content%2fuploads%2f2021%2f06%2fblank-profile-picture-973460_960_720-1-400x400.png&ehk=ITnmgofPuK7Ob7bTkCa7Vu3QKPrH21Ys2Rmrvtw%2bhPE%3d&risl=&pid=ImgRaw&r=0";
    },
  },
  dateJoined: {
    type: Date,
    default: Date.now,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
  },
  DOB: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const RegisterModel = mongoose.model('users', registerSchema);

module.exports = RegisterModel;
