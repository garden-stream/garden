let bcrypt = require('bcrypt')
let User = require('../models/User');
let jwt = require('jsonwebtoken')

module.exports = function (express) {
  let router = express.Router()
  router.route('/signup')
    .post(function (req, res, next) {
      console.log(`[garden] POST /api/signup`, req.body)
      req.body.password = bcrypt.hashSync(req.body.password, 10)
      console.log('pass hash:', req.body.password)
      if (!req.body) {
        return res.status(400).json({
          error: 'empty body'
        })
      }
      let newU = new User(req.body);
      newU.save(function (err, user) {
        if (err) {
          console.error(err)
          if (err.code === 11000) {
            res.status(400).json({
              'error': 'Username already in use.'
            })
          } else {
            res.status(400).json({
              'error': err
            })
          }
        } else {
          console.info('user added')
          let token = jwt.sign(user, 'a super secret awesome phras 312e');
          res.status(201).json({
            username: user.username,
            token: token
          })
        }
      })
    })
  router.route('/login')
    .post(function (req, res, next) {
      console.log(`[garden] POST /api/login`, req.body)
      if (!req.body) {
        return res.status(400).json({
          error: 'empty body'
        })
      }
      let newU = new User(req.body);
      User.findOne({
        username: req.body.username
      }, function (err, user) {
        if (err) {
          return res.status(401).json({
            error: 'unauthorized'
          })
        }
        if (!user) {
          return res.status(401).json({
            error: 'unauthorized'
          })
        }
        if (bcrypt.compareSync(req.body.password, user.password)) {
          user.password = null
          let token = jwt.sign(user, 'a super secret awesome phras 312e');
          res.status(201).json({
            username: user.username,
            token: token
          })
        } else {
          return res.status(401).json({
            error: 'unauthorized'
          })
        }
      })
    })
  return router
}