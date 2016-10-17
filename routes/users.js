let bcrypt = require('bcrypt')
let User = require('../models/User');
let jwt = require('jsonwebtoken')

module.exports = function (express) {
  let router = express.Router()
  router.route('/') // /api/user/
  .get(function (req, res, next) {
    User.find({}, '-password', function(err, users) {
      if (err) {
      	res.status(400).json({'error':err})
      } else {
      res.status(200).json(users);
      }
    })
  })
  // /api/user/{id}
  router.route('/:_id')
  .get(function (req, res, next) {
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
  
  // router.route('/:_id/questions')
  // .get(function (req, res) {
  //   User.findOne({_id: req.params._id}, '-password', function (error, user) {
  //     Question.find({userId: user._id}, function (error, questions) {
  //       res.status(200).json([{user: user, questions: questions}]);
  //     });
  //   })
  // })
  return router
}