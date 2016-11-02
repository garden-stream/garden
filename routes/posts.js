let bcrypt = require('bcrypt')
let User = require('../models/User')
let Post = require('../models/Post')
let jwt = require('jsonwebtoken')

module.exports = function (express) {
  let router = express.Router()
  
  router.route('/:id') 
    // requires user. Adds post to req.user
    .put((req, res, next) => {
      console.log(`[garden] PUT /api/post`, req.body)
      if (!req.user) { return res.status(401).json({ error: 'Unauthorized' })}
      Post.findOneAndUpdate({author_id: req.user._id, _id: req.params.id}, {
        content: req.body.content,
        contentType: req.body.contentType
      })
      .exec(function (err, post) {
        if (err) { return res.status(400).json({'error':err})
        } else {
          post.save(function (err, post) {
            if (err) { return res.status(400).json({'error':err}) }
            console.log('Success!');
            res.status(201).json(post)
          })
        }     
      })
    })
  
  router.route('/') 
    // requires user. Adds post to req.user
    .post((req, res, next) => {
      console.log(`[garden] POST /api/post`, req.body)
      // check auth
      if (!req.user) { return res.status(401).json({ error: 'Unauthorized' })}
      User.findOne({_id: req.user._id}, '-password')
      .exec(function (err, user) {
        if (err) { return res.status(400).json({'error':err})
        } else {
          console.info('Found the user, adding post')
          let newPost = new Post(req.body)
          newPost.save(function (err, user) {
            if (err) { return res.status(400).json({'error':err}) }
            console.log('Success!');
            res.status(201).json(newPost)
          })
        }     
      })
    })
  return router
}