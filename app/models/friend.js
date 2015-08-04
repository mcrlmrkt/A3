var mongoose = require('mongoose');

var friendSchema = mongoose.Schema({
	username:String,
	friend:String
});

module.exports = mongoose.model('FriendList', friendSchema);
