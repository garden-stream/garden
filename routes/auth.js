let bcrypt = require('bcrypt')
let User = require('../models/User');
let jwt = require('jsonwebtoken')

module.exports = function (express) {
  let router = express.Router()
  router.route('/signup')
    .post(function (req, res, next) {
      if (!req.body) {
        return res.status(400).json({
          error: 'empty body'
        })
      }
      req.body.password = bcrypt.hashSync(req.body.password, 10)
      console.log(`[garden] POST /api/signup`, req.body.username)
      let newUser = new User(req.body);
      newUser.save(function (err, user) {
        if (err) {
          if (err.code === 11000) {
            console.error(`[garden] Failed to save new user "${req.body.username}". Username already exists.`, err)
            res.status(400).json({
              'error': 'Username already in use.'
            })
          } else {
            console.error(`[garden] Failed to save new user "${req.body.username}".`, err)
            res.status(400).json({
              'error': err
            })
          }
        } else {
          console.info(`[garden] User "${user}" created.`)
          let token = jwt.sign({username: user.username, _id: user._id}, 'a super secret awesome phras 312e');
          res.status(201).json({
            username: user.username,
            token: token
          })
        }
      })
    })
  router.route('/login')
    .post(function (req, res, next) {
      console.log(`[garden] POST /api/login`, req.body.username)
      if (!req.body) {
        console.error(`[garden] Login attempt failed. No request body provided.`)
        return res.status(400).json({
          error: 'empty body'
        })
      }
      User.findOne({
        username: req.body.username
      }, function (err, user) {
        if (err) {
          console.warn(`[garden] finding user "${req.body.username} failed."`, err)
          return res.status(401).json({
            error: 'unauthorized'
          })
        }
        if (!user) {
          console.warn(`[garden] Login attempt failed for user "${req.body.username}". User does not exist.`)
          return res.status(401).json({
            error: 'unauthorized'
          })
        }
        if (bcrypt.compareSync(req.body.password, user.password)) {
          user.password = null
          console.log('[garden] Login attempt:', user)
          let token = jwt.sign({username: user.username, _id: user._id}, 'a super secret awesome phras 312e');
          return res.status(201).json({
            username: user.username,
            token: token
          })
        } else {
          console.warn(`[garden] Login attempt failed for user "${req.body.username}". Invalid password.`)
          return res.status(401).json({
            error: 'unauthorized'
          })
        }
      })
    })
  return router
}