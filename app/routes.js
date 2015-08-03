var User = require('./models/user');
var mongodb = require('mongodb').MongoClient;

// Connect to the db
mongodb.connect('mongodb://Muhsanah:csc309sanah@ds061158.mongolab.com:61158/coursetackle', function(err, db) {
  if(!err) {
    console.log("We are connected");
  }
});

module.exports = function(app, passport){
	app.get('/', function(req, res){
		res.render('index.ejs', { message: req.flash('loginMessage')});
	});

	app.post('/', passport.authenticate('local-login', {
		successRedirect: '/newsfeed',
		failureRedirect: '/',
		failureFlash: true
	}));

	app.post('/auth/google/callback', passport.authenticate('local-googlePlus-login'), function(req, res) {
  		// Return user profile back to client
  		res.send(req.user);
	});
	app.get('/newsfeed', isLoggedIn, function(req, res, next) {
		console.log("Get NewsFeed");
		res.render('./newsfeed.ejs', 
			{	title: 'Course Tackle - News Feed',
		 		user: req.user });
	});

	app.get('/signup', function(req, res){
		res.render('signup.ejs', {message: req.flash('signupMessage')});
	});

	//when submit, going to post to our server
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/newsfeed',
		failureRedirect: '/signup',
		failureFlash: true
	}));

	app.get('/profile', isLoggedIn, function(req, res){
		res.render('./profile.ejs', 
			{ title: 'Course Tackle - ' + req.user.local.firstName + " " + req.user.local.lastName,
		 		 user: req.user });
	});

	app.get('/course', isLoggedIn, function(req, res){
		res.render('./course.ejs', { 
				title: 'Course Tackle - ' + req.user.local.firstName + " " + req.user.local.lastName,
		 		user:req.user});
	});

	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});
	
	app.post('/newsfeed', function(req, res, done){
			mongodb.connect('mongodb://Muhsanah:csc309sanah@ds061158.mongolab.com:61158/coursetackle', function(err, db) {
					if(!err) {
					   console.log("We are connected");
					}
					if(req.user){
						var newPassword = req.body.settings_password;
						var newFirstName = req.body.settings_firstName;
						var newLastName = req.body.settings_lastName;
						var newField = req.body.settings_field;
						var newEmail = req.body.settings_email;

						var collection = db.collection('users');

						console.log('password: ' + newPassword + " "
							+ 'firstName: '+ newFirstName + " "
						 	+ 'lastName: '+ newLastName + " "
						 	+ 'field: ' + newField + " "
						 	+ 'email: ' + newEmail);
						console.log(req.user);
						console.log(req.user.id);

						User.findOne({_id: req.user.id}, function(err, user){
							if (newPassword != ""){
								user.local.password = newPassword; 
							}
							if (newFirstName != ""){
								user.local.firstName = newFirstName;
							}
							if (newLastName != ""){
								user.local.lastName = newLastName;
							}
							if (newField != ""){
								user.local.field = newField;
							}
							if (newEmail != ""){
								user.local.email = newEmail;
							}

							user.save(function(err){
								if (err){
									console.log('user not found/cant save');
								} else {
									console.log('user saved');
									console.log(user);
								}
							})
						})
					}
				db.close();
			})
		res.redirect(req.get('referer'));
	});
}

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}
	else {
		res.redirect('/');
	}
}

