var User = require('./models/user');

module.exports = function(app, passport){
	app.get('/', function(req, res){
		res.render('index.ejs', { message: req.flash('loginMessage')});
	});

	app.post('/', passport.authenticate('local-login', {
		successRedirect: '/newsfeed',
		failureRedirect: '/',
		failureFlash: true
	}));

	app.post('/auth/google/callback', passport.authenticate('local-googlePlus-login', {
		successRedirect: '/newsfeed',
		failureRedirect: '/',
		failureFlash: true
	    //res.send(req.user);
	}));

	app.get('/signup', function(req, res){
		res.render('signup.ejs', {message: req.flash('signupMessage')});
	});

	//when submit, going to post to our server
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/newsfeed',
		failureRedirect: '/signup',
		failureFlash: true
	}));
		
	app.get('/newsfeed', isLoggedIn, function(req, res, next) {
		console.log("Get NewsFeed");
		res.render('./newsfeed.ejs', 
			{	title: 'Course Tackle - News Feed',
		 		user: req.user });
	});

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

};

function isLoggedIn(req, res, next) {
	console.log('THIS IS THE SESSION BEFORE: ' + req.session);
	if(req.isAuthenticated()){
		return next();
	}
	else {
		res.redirect('/');
	}
}

