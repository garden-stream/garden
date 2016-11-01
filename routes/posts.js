let bcrypt = require('bcrypt')
let User = require('../models/User')
let jwt = require('jsonwebtoken')

module.exports = function (express) {
  let router = express.Router()
  
  router.route('/:id') 
    // requires user. Adds post to req.user
    .put((req, res, next) => {
      console.log(`[garden] PUT /api/post`, req.body)
      if (!req.user) { return res.status(401).json({ error: 'Unauthorized' })}
      User.findOneAndUpdate({_id: req.user._id, 'posts._id': req.params.id}, {
        'posts.$.content': req.body.content,
        'posts.$.contentType': req.body.contentType
      }, '-password')
      .exec(function (err, user) {
        if (err) { return res.status(400).json({'error':err})
        } else {
          user.save(function (err, user) {
            if (err) { return res.status(400).json({'error':err}) }
            console.log('Success!');
            res.status(201).json(user)
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
          user.posts.push(req.body)
          user.save(function (err, user) {
            if (err) { return res.status(400).json({'error':err}) }
            console.log('Success!');
            res.status(201).json(user)
          })
        }     
      })
    })
  return router
}