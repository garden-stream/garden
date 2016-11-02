let mongoose = require('mongoose')

let postSchema = mongoose.Schema({
  contentType: String,
  content: String,
}, {
  timestamps: true
})

let Posts = mongoose.model('post', postSchema)

module.exports = Posts