var db = require('monk')(process.env.MONGOLAB_URI)
var userCollection = db.get('users')
var listCollection = db.get('lists')
var itemCollection = db.get('items')
var bcrypt = require('bcrypt')

module.exports = {

  newList: function(title, item){
    var errors = [];
    if(title === ''){
      errors.push('Title of list cannot be blank.')
    }
    if(item.length === 0){
      errors.push('You must have at least one item on your list.')
    }
    return errors
  },

  signUp: function(username, email, createPassword, confirmPassword){

    var signup = new Promise(function(resolve, reject) {
      var lowerCase = email.toLowerCase();
      var newEmail = lowerCase.replace(" ", "");
      userCollection.find({email: newEmail}).then(function(user){
        var errors = [];
        if(user.length > 0){
          errors.push('Please enter a unique email address.')
        }
        if(username === ''){
          errors.push('Username cannot be blank.')
        }
        if(email === ''){
          errors.push('Email cannot be blank.')
        }
        if(createPassword === ''){
          errors.push('Create password cannot be blank.')
        }
        if(confirmPassword === ''){
          errors.push('Confirm password cannot be blank.')
        }
        if(createPassword != confirmPassword){
          errors.push('Passwords must match.')
        }
        if(errors.length > 0){
          resolve(errors)
        } else {
          var hash = bcrypt.hashSync(createPassword, 8);
          return userCollection.insert({username: username, email: newEmail, password: hash})
          }
        }).then(function(user){
          resolve('success')
    });
  })
    return signup
  },

  findUser: function(email){

    var findUser = new Promise(function(resolve, reject) {
      console.log('in promise');
      userCollection.findOne({email: email}).then(function (user) {
        console.log('promise fulfilled');
        resolve(user)
      })
    });
    return findUser
  }

}
