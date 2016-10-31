let bcrypt = require('bcrypt')
let User = require('../models/User')
let jwt = require('jsonwebtoken')

module.exports = function (express) {
  let router = express.Router()
  router.route('/') // /api/user/
    .get((req, res, next) => {
      console.log(`[garden] GET /api/user`)
      User.find({}, '-password', function(err, users) {
        if (err) {
          res.status(400).json({'error':err})
        } else {
        res.status(200).json(users);
        }
      })
    })
    // /api/user/{username}
    router.route('/:username')
    .get((req, res, next) => {
      console.log(`[garden] GET /api/user/${req.params.username}`)
      if (req.user) {
        console.log('authenticated request')
      }
      User.findOne({_id: req.params._id}, '-password', function (err, user) {
        if (err) {
          res.status(400).json({'error':err})
        } else {
          console.info('Found the user')
          res.status(200).json(user)
        }     
      });
    })

  router.route('/:username/followers')
    .get((req, res, next) => {
      console.log(`[garden] GET /api/user/${req.params._id}/followers`)
      User.findOne({_id: req.params._id}, 'followers')
      .populate('followers', '-password')
      .exec(function (err, user) {
        if (err) {
          res.status(400).json({'error':err})
        } else {
          console.info('Found the user')
          res.status(200).json(user)
        }     
      })
    })

  router.route('/:username/following')
    .get((req, res, next) => {
      console.log(`[garden] GET /api/user/${req.params._id}/following`)
      User.findOne({_id: req.params._id}, 'following')
      .populate('following', '-password')
      .exec(function (err, user) {
        if (err) {
          res.status(400).json({'error':err})
        } else {
          console.info('Found the user')
          res.status(200).json(user)
        }     
      })
    })

  router.route('/:username/posts')
    .get((req, res, next) => {
      console.log(`[garden] GET /api/user/${req.params._id}/posts`)
      User.findOne({_id: req.params._id}, 'posts')
      // .populate('following', '-password')
      .exec(function (err, user) {
        if (err) {
          res.status(400).json({'error':err})
        } else {
          console.info('Found the user and posts')
          res.status(200).json(user)
        }     
      })
    })

  router.route('/:username/follow') 
    // requires user. Adds the _id user to the list of
    // "followed" users on the req.user
    .post((req, res, next) => {
      console.log(`[garden] POST /api/user/${req.params._id}/follow`)
      // check auth
      if (!req.user) { return res.status(401).json({ error: 'Unauthorized' })}
      User.findOne({_id: req.user._id}, '-password')
      .exec(function (err, user) {
        if (err) { return res.status(400).json({'error':err})
        } else {
          console.info('Found the user, adding follower')
          user.following.push(req.params._id)
          user.save(function (err, user) {
            if (err) { return res.status(400).json({'error':err}) }
            console.log('Success!');
            res.status(201).json(user)
          })
        }     
      })
  })
  
  // router.route('/:_id/questions')
  //   .get(function (req, res) {
  //     User.findOne({_id: req.params._id}, '-password', function (error, user) {
  //       Question.find({userId: user._id}, function (error, questions) {
  //         res.status(200).json([{user: user, questions: questions}]);
  //       });
  //     })
  //   })
  return router
}