var db = require('monk')(process.env.MONGOLAB_URI)
var userCollection = db.get('users')
var listCollection = db.get('lists')
var itemCollection = db.get('items')

module.exports = {
  addList: function(title, item){
    itemCollection.insert({name: item}).then(function(item){
      listCollection.insert({
        name: item,
        // userId: req.cookies.currentUser,
        itemIds: [item._id]
      }).then(function(list){
        userCollection.update({_id: req.cookies.currentUser}, {
        })
      })
  }
}
