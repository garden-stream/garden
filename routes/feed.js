let bcrypt = require('bcrypt')
let User = require('../models/User')
let jwt = require('jsonwebtoken')

module.exports = function (express) {
  let router = express.Router()
  
  router.route('/') 
    // requires user. Adds post to req.user
    .get((req, res, next) => {
      // check auth
      if (!req.user) { return res.status(401).json({ error: 'Unauthorized' })}
      console.log(`[garden] GET /api/feed:`, req.user.username)
      User.findOne({_id: req.user._id}, 'following')
      .populate('following', 'username posts')
      .exec(function (err, users) {
        if (err) { return res.status(400).json({'error':err})
        } else {
          let posts = []
          users.following.forEach(function (user, idx) {
            posts = posts.concat(user.posts.forEach(function (post) {
              post.author = user.username
            }))
          })
          return res.status(200).json(posts)
        }     
      })
    })
  return router
}