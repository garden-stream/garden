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
      console.log(`[garden] POST /api/feed:`, req.user.username)
      User.findOne({_id: req.user._id}, 'following')
      .populate('following', '-password')
      .exec(function (err, users) {
        if (err) { return res.status(400).json({'error':err})
        } else {
          return res.status(200).json(users)
        }     
      })
    })
  return router
}