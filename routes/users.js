let bcrypt = require('bcrypt')
let User = require('../models/User')
let Post = require('../models/Post')
let jwt = require('jsonwebtoken')

module.exports = function (express) {
  let router = express.Router()
  router.route('/') // /api/user/
    .get((req, res, next) => {
      console.log(`[garden] GET /api/user`)
      User.find({}, '-password')
      .sort('-updatedAt')
      .exec(function(err, users) {
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
      User.findOne({username: req.params.username}, '-password', function (err, user) {
        if (err) {
          res.status(400).json({'error':err})
        } else {
          console.info('Found the user')
          if (!user) {
            return res.status(400).json({'error': 'no user found'})
          }
          res.status(200).json(user)
        }     
      });
    })

  router.route('/:username/followers')
    .get((req, res, next) => {
      console.log(`[garden] GET /api/user/${req.params.username}/followers`)
      User.findOne({username: req.params.username}, 'followers')
      .populate('followers', '-password')
      .sort('-updatedAt')
      .exec(function (err, user) {
        if (err) {
          res.status(400).json({'error':err})
        } else {
          console.info('Found the user')
          if (!user) {
            return res.status(400).json({'error': 'no user found'})
          }
          res.status(200).json(user.followers)
        }     
      })
    })

  router.route('/:username/following')
    .get((req, res, next) => {
      console.log(`[garden] GET /api/user/${req.params.username}/following`)
      User.findOne({username: req.params.username}, 'following')
      .populate('following', '-password', null,
        { sort: { 'updatedAt': -1 } })
      .exec(function (err, user) {
        if (err) {
          res.status(400).json({'error':err})
        } else {
          console.info('Found the user')
          if (!user) {
            return res.status(400).json({'error': 'no user found'})
          }
          res.status(200).json(user.following)
        }     
      })
    })

  router.route('/:username/posts')
    .get((req, res, next) => {
      console.log(`[garden] GET /api/user/${req.params.username}/posts`)
      User.findOne({username: req.params.username})
      .exec(function (err, user) {
        if (err) {
          res.status(400).json({'error':err})
        } else {
          console.info('Found the user')
          Post.find({author_id: user._id})
          .exec(function (err, posts) {
            if (err) {
              res.status(400).json({'error':err})
            } else {
              res.status(200).json(posts)
            }
          })
        }     
      })
    })

  router.route('/:_id/follow') 
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
          // console.info('Found the user, adding following')
          user.following.push(req.params._id)
          user.save(function (err, user) {
            if (err) { return res.status(400).json({'error':err}) }
            console.log('Success following...')
            User.findOne({_id: req.params._id}, '-password')
            .exec(function (err, user2) {
              if (err) { return res.status(400).json({'error':err})
              } else {
                // console.info('Found the user, adding follower')
                user2.followers.push(req.user._id)
                user2.save(function (err, user2) {
                  if (err) { return res.status(400).json({'error':err}) }
                  console.log('Success!')
                  res.status(201).json(user)
                })
              }     
            })
            // res.status(201).json(user)
          })
        }     
      })
  })
  
  router.route('/:_id/unfollow') 
    // requires user. Adds the _id user to the list of
    // "followed" users on the req.user
    .put((req, res, next) => {
      console.log(`[garden] PUT /api/user/${req.params._id}/follow`)
      // check auth
      if (!req.user) { return res.status(401).json({ error: 'Unauthorized' })}
      User.findOne({_id: req.user._id}, '-password')
      .exec(function (err, user) {
        if (err) { return res.status(400).json({'error':err})
        } else {
          // console.info('Found the user, adding following')
          user.following.pull(req.params._id)
          user.save(function (err, user) {
            if (err) { return res.status(400).json({'error':err}) }
            console.log('Success unfollowing...')
            User.findOne({_id: req.params._id}, '-password')
            .exec(function (err, user2) {
              if (err) { return res.status(400).json({'error':err})
              } else {
                // console.info('Found the user, adding follower')
                user2.followers.pull(req.user._id)
                user2.save(function (err, user2) {
                  if (err) { return res.status(400).json({'error':err}) }
                  console.log('Success!')
                  res.status(200).json(user)
                })
              }     
            })
          })
        }     
      })
  })
  return router
}