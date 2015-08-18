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
  var items = [req.body.item, req.body.item1, req.body.item2, req.body.item3, req.body.item4, req.body.item5, req.body.item6, req.body.item7, req.body.item8, req.body.item9]
  validations.newList(req.body.title, items, req.session.currentUser).then(function (data) {
    console.log(data);
    if(data === 'success'){
      res.redirect('/lists')
    } else {
      res.render('lists/new', {errorMessage: 'Please fix the errors listed below:', errors: data})
    }
  })
});

router.get('/showAll', function (req, res, next) {
  validations.showAll(req.session.currentUser).then(function (lists) {
    console.log(lists);
    res.render('lists/showAll', {lists: lists})
  })
})


module.exports = router;
