var LocalStrategy = require('passport-local').Strategy;
var GooglePlusStrategy = require('passport-google-plus');
var bCrypt = require('bcrypt-nodejs');
var util = require('util');

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
		passReqToCallback: true
	},
	function(req, username, password, done){
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
					newUser.local.firstName = req.body.firstName;
					newUser.local.lastName = req.body.lastName;
					newUser.local.field = req.body.field;
					newUser.local.email = req.body.email;
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
		function(req, username, password, done){
			process.nextTick(function(){
				User.findOne({ 'local.username': username}, function(err, user){
					if(err)
						return done(err);
					if(!user)
						return done(null, false, req.flash('loginMessage', 'No User found'));
					if(!isValidPassword(user, password)){
						return done(null, false, req.flash('loginMessage', 'Invalid password'));
					}
					console.log('THIS IS THE USER: ' );
					return done(null, user);
				});
			});
		}
	));

	passport.use('local-googlePlus-login', new GooglePlusStrategy({
	    clientId: '72300732710-h8nos27som0091shjl9j5kmn3dsrvb1g.apps.googleusercontent.com',
	    clientSecret: 'LC4vHOn-o6QHKg93ddcCYb4A'
	  },
	  function(tokens, profile, done) {
	    // Create or update user, call done() when complete...
		//console.log(util.inspect(profile, {showHidden: false, depth: null}));
	    console.log("profile info: " + profile.id);
	    console.log("profile info: " + profile.name.familyName);
	    console.log("profile info: " + profile.email);
	    console.log("profile info: " + profile.name.givenName);
	    var newUser = new User();
		User.findOne({'local.username': profile.name.givenName + profile.name.familyName}, function(err, user){
			if(err)
				return done(err);
			newUser.local.username = profile.name.givenName + profile.name.familyName;
			if(user){ //don't want to reregister the user
				newUser.local.username = profile.name.givenName + profile.name.familyName + profile.id;
			}
			if (profile.email_verified) {
				newUser.local.username = profile.email;
			}
			newUser.local.password = createHash(profile.name.givenName + profile.name.familyName + "Password");
			newUser.local.firstName = profile.name.familyName;
			newUser.local.lastName = profile.name.givenName;
			newUser.local.field = "";
			newUser.local.email = profile.email;
			newUser.save(function(err){
				if(err)
					throw err;
				return done(null, newUser);
			});
		});

	    return done(null, newUser);
	  }
	));

	var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.local.password);
    };
    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };
};