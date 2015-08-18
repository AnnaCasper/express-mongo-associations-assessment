var express = require('express');
var router = express.Router();
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
    console.log(req.session.currentUser);
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
  validations.newList(req.body.title, req.body.item, req.session.currentUser).then(function (data) {
    if(data === 'success'){
      res.redirect('/lists/index')
    } else {
      res.render('lists/new', {errorMessage: 'Please fix the errors listed below:', errors: data})
    }
  })
})


module.exports = router;
