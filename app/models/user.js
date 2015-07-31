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

var fieldSchema = mongoose.Schema({
	local:{
		fieldname: String,
		fieldcode: String
	}
});

var commentSchema = mongoose.Schema({
	local:{
		comment: String
	}
});

var courseSchema = mongoose.Schema({
	local: {
		coursename: String,
		coursecode: String,
		rating: String
	}
});

module.exports = mongoose.model('User', userSchema);
module.exports = mongoose.model('Field', fieldSchema);
module.exports = mongoose.model('Comment', commentSchema);
module.exports = mongoose.model('Course', courseSchema);
