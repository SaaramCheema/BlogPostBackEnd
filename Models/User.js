const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  roles: {
    type: String,
    required: true,
  },
  posts:[{type: mongoose.Types.ObjectId, ref:"Post", required:true}],
  following:[{type: mongoose.Types.ObjectId, ref:"User", required:true}]
});

const User = mongoose.model('User', userSchema);

module.exports = User;