let mongoose = require('mongoose')
let postSchema = require('./Post')

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
  }]
}, {
  timestamps: true
})
userSchema.methods.getPosts = function(callback) {
  return postSchema.find({
    author_id: this._id
  }, callback)
}

let Users = mongoose.model('user', userSchema)

module.exports = Users;