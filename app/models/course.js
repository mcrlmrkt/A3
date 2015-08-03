var mongoose = require('mongoose');

var courseSchema = mongoose.Schema({
	local: {
		username: String,
		field: {type: String, required: true},
		courseName: {type: String, required: true},
		courseCode: {type: String, required: true},
        desc: {type: String, required: true},
		rating: {type: Number, min:1, max:5, required: true},
		created_at: {type: Date, default: Date.now}
	}
});

module.exports = mongoose.model('Course', courseSchema);