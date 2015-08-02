var User = require('../app/models/user');

module.exports = function(user){
	function(req, res, done){
		User.findOne({'local.username': user.local.username}, 
			function(err, user){
				if (err)
					return done(err);
				if (user){
					var newPassword = req.body.settings_password;
					var newFirstName = req.body.settings_firstName;
					var newLastName = req.body.settings_lastName;
					var newField = req.body.settings_field;
					var newEmail = req.body.settings_email;

					if (newPassword != "")	
						user.local.password = newPassword;
					if (newFirstName != "")
						user.local.firstName = newFirstName;
					if (newLastName != "")
						user.local.lastName = newLastName;
					if (newField != "")
						user.local.field = newField;
					if (newEmail != "")	
						user.local.email = newEmail;
				}
			}
		)
	}
}