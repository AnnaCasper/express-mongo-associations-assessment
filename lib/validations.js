var db = require('monk')(process.env.MONGOLAB_URI)
var userCollection = db.get('users')
var listCollection = db.get('lists')
var itemCollection = db.get('items')
var bcrypt = require('bcrypt')
var session = require('cookie-session')


module.exports = {

  newList: function(title, items, user){
    var newList = new Promise(function(resolve, reject) {
      var errors = [];
      if(title === ''){
        errors.push('Title of list cannot be blank.')
      }
      if(items[0].length === 0){
        errors.push('You must have at least one item on your list.')
      }
      if(errors.length > 0){
        resolve(errors)
      } else {
        listCollection.insert({
          name: title,
          userId: user,
          itemIds: [],
          sharedUserIds: []
          }).then(function(list){
            items.forEach(function (item) {
              itemCollection.insert({name: item.item, check: item.check}).then(function(item){
                return listCollection.update({_id: list._id}, {$push: {itemIds: item._id} }).then(function () {
                  return userCollection.update({_id: user}, {$push: {listIds: list._id} })
                })
              })
            })
          }).then(function(user){
          resolve('success')
        });
      }
    });
  return newList
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
        if(createPassword.length < 7){
          errors.push('Password must be atleast 7 characters long.')
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
          return userCollection.insert({username: username, email: newEmail, password: hash, listIds: [], friendsIds: []})
          }
        }).then(function(user){
          resolve('success')
    });
  })
    return signup
  },

  findUser: function(email){

    var findUser = new Promise(function(resolve, reject) {
      userCollection.findOne({email: email}).then(function (user) {
        resolve(user)
      })
    });
    return findUser
  },

  showAll: function(user){
    return userCollection.findOne({_id: user}).then(function (user) {
      return listCollection.find({_id: {$in: user.listIds}}).then(function (lists) {
        if(lists.length === 0){
          return []
        } else {
          var promises = []
          lists.forEach(function (list) {
            var promise = itemCollection.find({_id: {$in: list.itemIds}}).then(function (items) {
              return items.map(function (item) {
                return {name: item.name, check: item.check}
              })
            })
            promises.push(promise)
          })
        return Promise.all(promises).then(function (data) {
          lists.forEach(function(list, i , array){
            list.items = data[i]
          })
          return lists
          })
        }
      })
    })
  },

  findOneList: function (listId) {
    var findOneList = new Promise(function(resolve, reject) {
      return listCollection.findOne({_id: listId}).then(function (list) {
        list.items = [];
        return itemCollection.find({_id: {$in: list.itemIds}}).then(function (items) {
          items.forEach(function (item) {
            list.items.push({name: item.name, check: item.check})
          })
          return list
        })
      }).then(function (list) {
        return userCollection.find({_id: {$in: list.sharedUserIds}}).then(function (users) {
          list.sharedNames = users.map(function (user) {
            return user.username
          })
          return list
        }).then(function (list) {
          resolve(list)
        })
      })
    });
    return findOneList
  },

  delete: function (listId) {
    var deleteOne = new Promise(function(resolve, reject) {
      listCollection.remove({_id: listId}).then(function () {
        resolve('success')
      })
    });
    return deleteOne
  },

  shareList: function(listId, email, currentUser){
    var shareList = new Promise(function(resolve, reject) {
      userCollection.findOne({email: email}).then(function (user) {
        if(user.length === 0){
          var errors = 'There is not a user associated with this email address.'
          resolve(errors)
        } else {
          console.log(user);
          return listCollection.update({_id: listId}, {$push: {sharedUserIds: user._id}})
          return userCollection.update({_id: currentUser}, {$push: {friendsIds: user._id}})
        }
      }).then(function () {
        resolve('success')
      })
    });
    return shareList
  },

  login: function(email, password){
    var lowerCase = email.toLowerCase();
    var newEmail = lowerCase.replace(" ", "");
    var errors = [];
    var login = new Promise(function(resolve, reject) {
      userCollection.findOne({email: newEmail}).then(function (user) {
        if(user){
          var compare = bcrypt.compareSync(password, user.password);
          if(compare === true){
            resolve(user)
          } else {
            errors.push('Email and password do not match.')
            resolve(errors)
          }
        } else {
          errors.push('There is not an account associated with this email address.')
          resolve(errors)
        }

      })
    });
    return login
  },

  updateOne: function (listId, itemArray) {
    var updateOne = new Promise(function(resolve, reject) {
      listCollection.findOne({_id: listId}).then(function(list){
        itemCollection.find({_id: {$in: list.itemIds}}).then(function (items) {
          items.forEach(function (item, i) {
            itemCollection.update({_id: item._id}, {
              name: itemArray[i].item,
              check: itemArray[i].check
            })
          })
        }).then(function () {
          resolve('success')
        })
      })
  });
  return updateOne
  },

  showAllShared: function (user) {
    return listCollection.find().then(function (lists) {
      var sharedListArray = [];
      lists.forEach(function (list) {
        var sharedList = list.sharedUserIds.map(function (userId){
          if(userId.toString() === user){
            return list
          }
        })
        if(sharedList.length > 0){
          if(sharedList[0]){
            sharedListArray.push(sharedList)
          }
        }
      })
      console.log(sharedListArray);
      return sharedListArray
    }).then(function (sharedListArray) {
      if(sharedListArray.length === 0){
        return [];
      } else {
        var promises = []
        sharedListArray.forEach(function (list) {
          var promise = itemCollection.find({_id: {$in: list[0].itemIds}}).then(function (items) {
            return items.map(function (item) {
              return {name: item.name, check: item.check}
            })
          })
          promises.push(promise)
        })
      return Promise.all(promises).then(function (data) {
        sharedListArray.forEach(function(list, i , array){
          list[0].items = data[i]
        })
        return sharedListArray
        })
      }
    })
  }

}
