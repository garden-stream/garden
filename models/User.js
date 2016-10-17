let mongoose = require('mongoose');

let userSchema = mongoose.Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  email: String
});

let Users = mongoose.model('Users', userSchema);

// make this available to our users in our Node applications
module.exports = Users;