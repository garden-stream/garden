module.exports = function (express) {
  let router = express.Router()
  let jwt = require('jsonwebtoken')
  router.use(function (req, res, next) {
    // console.log('headers:', req.headers)
    if (req.headers.token || req.body.token) {
      jwt.verify(req.headers.token || req.body.token, 'a super secret awesome phras 312e', 
      function (err, user) {
        if (err) {
          return res.status(401).json({
            error: 'Unauthorized'
          })
        } else {
          console.log('user:', user._doc)
          req.user = user._doc
          next()
        }
      })
    } else {
     next()
    }
  })
  router.use('/auth', require('./auth')(express))
  router.use('/user', require('./users')(express))
  router.use('/post', require('./posts')(express))
  router.get('/', function (req, res, next) {
    res.json({msg: 'Welcome to the api'})
    console.log(`[garden] GET: /api`)
  })
  return router
}
