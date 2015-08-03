var mongoose = require('mongoose');

var friendReqSchema = mongoose.Schema({
	username:String,
	pendingFriend:{type: String, unique: true}
});

module.exports = mongoose.model('FriendReq', friendReqSchema);
