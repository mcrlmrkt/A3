var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');

var User = require('../app/models/user');

module.exports = function(passport) {

	passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(err, user);
		});
	});

	passport.use('local-signup', new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password',
		firstNameField: 'firstName',
		lastNameField: 'lastName',
		fieldField: 'field',
		emailField: 'email',
		passReqToCallback: true
	},
	function(req, username, password, 
		firstName, lastName, field, email, done){
		process.nextTick(function(){
			//look up in db where username matches the username
			User.findOne({'local.username': username}, function(err, user){
				if(err)
					return done(err);
				if(user){ //don't want to reregister the user
					return done(null, false, req.flash('signupMessage', 'That username is already taken'));
				} else { //otherwise create a new user
					var newUser = new User();
					newUser.local.username = username;
					newUser.local.password = createHash(password);
					newUser.local.firstName = firstName;
					newUser.local.lastName = lastName;
					newUser.local.field = field;
					newUser.local.email = email;

					newUser.save(function(err){
						if(err)
							throw err;
						return done(null, newUser);
					})
				}
			})

		});
	}));

	passport.use('local-login', new LocalStrategy({
			usernameField: 'username',
			passwordField: 'password',
			passReqToCallback: true
		},
		function(req, username, password, firstName, lastName, field, email, done){
			process.nextTick(function(){
				User.findOne({ 'local.username': username}, function(err, user){
					if(err)
						return done(err);
					if(!user)
						return done(null, false, req.flash('loginMessage', 'No User found'));
					if(isValidPassword(username, password)){
						return done(null, false, req.flash('loginMessage', 'inavalid password'));
					}
					return done(null, user);

				});
			});
		}
	));

	var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    };
    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };
};