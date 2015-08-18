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


router.get('/new', function(req, res, next){
  if(req.session.currentUser){
    res.render('lists/new')
  } else {
    res.redirect('/');
  }
});

router.post("/new", function(req, res, next){
  var items = [{item: req.body.item,
                check: req.body.checkItem},
                {item: req.body.item1,
                check: req.body.checkItem1},
                {item: req.body.item2,
                check: req.body.checkItem2},
                {item: req.body.item3,
                check: req.body.checkItem3},
                {item: req.body.item4,
                check: req.body.checkItem4},
                {item: req.body.item5,
                check: req.body.checkItem5},
                {item: req.body.item6,
                check: req.body.checkItem6},
                {item: req.body.item7,
                check: req.body.checkItem7},
                {item: req.body.item8,
                check: req.body.checkItem8},
                {item: req.body.item9,
                check: req.body.checkItem9}]
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

router.get('/:id/edit', function (req, res, next) {
  validations.findOneList(req.params.id).then(function (list) {
    res.render('lists/edit', {list: list})
  })
});

router.post('/:id/delete', function (req, res, next) {
  validations.delete(req.params.id).then(function (data) {
    if(data === 'success'){
      res.redirect('/lists/showAll')
    }
  })
})


module.exports = router;
