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
    var errors = [];
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
    return errors
  }

}
