var mongoose = require('mongoose');

var friendReqSchema = mongoose.Schema({
	username:String,
	pendingFriend:String
});

module.exports = mongoose.model('FriendReq', friendReqSchema);
