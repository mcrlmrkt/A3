var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	local: {
		username: String,
		password: String,
		field: String,
		firstName: String,
		lastName: String,
		field: String,
		email: String
	}
});


module.exports = mongoose.model('User', userSchema);
