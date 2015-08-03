var User = require('../app/models/user');

module.exports = function(user){

	User.findOne({'local.username': user.local.username}, function(err, user){
		if(err)
			return done(err);
		if (user)
			user.update({'local.password': user.local.password}, {$set: req.body.settings_password});
	}			
}