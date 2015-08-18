var express = require('express');
var router = express.Router();
var script = require('../lib/script.js');
var validations = require('../lib/validations.js')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/signup', function(req, res, next){
  res.render('users/new')
})

router.post('/signup', function(req, res, next){
  var errors = validations.signUp(req.body.username, req.body.email, req.body.createPassword, req.body.confirmPassword);
  console.log(errors);
  if(errors.length > 0){
    res.render('users/new', {errorMessage: 'Please correct the errors listed below:',
                                errors: errors,
                                username: req.body.username,
                                email: req.body.email})
  } else {
    script.addUser(req.body.username, req.body.email, req.body.createPassword)
    res.redirect('/lists')
  }
})

module.exports = router;
