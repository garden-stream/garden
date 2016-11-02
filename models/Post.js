let mongoose = require('mongoose')

let postSchema = mongoose.Schema({
  contentType: String,
  content: String,
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    index: true
  }
}, {
  timestamps: true
})

let Posts = mongoose.model('post', postSchema)

module.exports = Posts