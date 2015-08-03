var mongoose = require('mongoose');

var friendSchema = mongoose.Schema({
	username:String,
	friend:{type: String, unique: true}
});

module.exports = mongoose.model('FriendList', friendSchema);
