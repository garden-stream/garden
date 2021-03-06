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
      console.log(`[garden] GET /api/search:`, req.query)
      let query = {}
      let searchTerm = req.query.displayName || req.query.username || ''
      let searchField = req.query.displayName ? 'displayName' : 'username'
      query[searchField] = new RegExp('^' + searchTerm, 'i')
      User.find(query, '-password -followers -following', {limit: 25}, function (err, users) {
        if (err) {
          return res.status(400).json({'error':err})
        } else {
          return res.status(200).json(users)
        }     
      })
    })
  return router
}