var db = require('monk')(process.env.MONGOLAB_URI)
var userCollection = db.get('users')
var listCollection = db.get('lists')
var itemCollection = db.get('items')
var bcrypt = require('bcrypt');
var cookieSession = require('express-session')

module.exports = {
  // addList: function(title, item){
  //   itemCollection.insert({name: item}).then(function(item){
  //     listCollection.insert({
  //       name: item,
  //       // userId: req.cookies.currentUser,
  //       itemIds: [item._id]
  //     }).then(function(list){
  //       userCollection.update({_id: req.cookies.currentUser}, {
  //       })
  //     })
  // },

  addUser: function(username, email, password){
    var lowerCase = email.toLowerCase();
    var newEmail = lowerCase.replace(" ", "");
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    userCollection.insert({username: username, email: newEmail, password: hash}).then(function(user){
      req.session = user._id
    })
  },

}
