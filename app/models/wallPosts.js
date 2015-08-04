var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	post: {
		to_user: {type: String, required: true},
		from_user: {type: String, required: true},
		wall_post: String
	}
});


module.exports = mongoose.model('wallPost', userSchema);
