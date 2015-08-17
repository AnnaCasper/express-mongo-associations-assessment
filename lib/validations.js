module.exports = {

  validateNew: function(title, item){
    var errors = [];
    if(title === ''){
      errors.push('Title of list cannot be blank.')
    }
    if(item.length === 0){
      errors.push('You must have at least one item on your list.')
    }
    return errors
  }

}
