var express = require('express');
var router = express.Router();
var script = require('../lib/script.js');
var validations = require('../lib/validations.js')

router.get('/', function(req, res, next){
  if(req.session.currentUser){
    res.render('lists/index')
  } else {
    res.redirect('/');
  }
});

router.get('/show', function(req, res, next) {
  if(req.session.currentUser){
    res.render('lists/show');
  } else {
    res.redirect('/');
  }
});

router.get('/new', function(req, res, next){
  if(req.session.currentUser){
    res.render('lists/new')
  } else {
    res.redirect('/');
  }
});

router.post("/new", function(req, res, next){
  var errors = validations.newList(req.body.title, req.body.item);
  if(errors.length > 0){
    res.render('lists/new', {errorMessage: 'Please fix the errors listed below:', errors: errors})
  } else {
    script.addList(req.body.title, req.body.item)
    res.redirect('/lists/index')
  }
})


module.exports = router;
