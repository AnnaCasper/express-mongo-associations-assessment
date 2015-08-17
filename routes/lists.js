var express = require('express');
var router = express.Router();
var script = require('../lib/script.js');
var validations = require('../lib/validations.js')

router.get('/', function(req, res, next){
  res.render('lists/index')
});

router.get('/show', function(req, res, next) {
  res.render('lists/show');
});

router.get('/new', function(req, res, next){
  res.render('lists/new')
});

router.post("/new", function(req, res, next){
  var errors = validations.validateNew(req.body.title, req.body.item);
})


module.exports = router;
