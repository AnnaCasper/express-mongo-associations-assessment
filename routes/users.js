var express = require('express');
var router = express.Router();
var validations = require('../lib/validations.js')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/signup', function(req, res, next){
  res.render('users/new')
})

router.post('/signup', function(req, res, next){
  validations.signUp(req.body.username, req.body.email, req.body.createPassword, req.body.confirmPassword).then(function(data){
    if(data === 'success'){
      validations.findUser(req.body.email).then(function (user) {
        req.session.currentUser = user._id
        res.redirect('/lists')
      })
    } else {
      res.render('users/new', {errorMessage: 'Please correct the errors listed below:',
                                  errors: data,
                                  username: req.body.username,
                                  email: req.body.email})
    }
  })
})

router.post('/login', function(req, res, next){
  validations.login(req.body.email, req.body.password).then(function (data) {
    if(data.username){
      req.session.currentUser = data._id
      res.redirect('/lists')
    } else {
      res.render('index', {errors: data})
    }
  })
})

router.get('/logout', function(req, res, next){
  req.session = null
  res.redirect('/');
})


module.exports = router;
