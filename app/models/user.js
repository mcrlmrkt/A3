var mongoose = require('mongoose');
//var dp = new Image;

var userSchema = mongoose.Schema({
	local: {
		username: {type: String, required: true, unique: true},
		password: {type: String, required: true},
		field: String,
		firstName: String,
		lastName: String,
		email: {type: String, required: true, lowercase: true},
		//photo: dp
	}
});


module.exports = mongoose.model('User', userSchema);
