let mongoose = require('mongoose');

let postSchema = mongoose.Schema({
  contentType: String,
  content: String
})

let userSchema = mongoose.Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    index: true,
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    index: true,
  }],
  posts: [postSchema]
})

let Users = mongoose.model('user', userSchema);

// make this available to our users in our Node applications
module.exports = Users;