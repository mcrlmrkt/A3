var User = require('./models/user');
var Course = require('./models/course');
var mongodb = require('mongodb').MongoClient;

// Connect to the db
mongodb.connect('mongodb://Muhsanah:csc309sanah@ds061158.mongolab.com:61158/coursetackle', function(err, db) {
  if(!err) {
    console.log("We are connected");
  }
});


module.exports = function(app, passport, test){
//var courses = ['Anthropology','Biology', 'Chemistry', 'Computer Science', 'Mathematics', 'Physics'];


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
		console.log(req.files);
		res.render('./newsfeed.ejs', 
			{	title: 'Course Tackle -` News Feed',
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

	// Course page

	app.get('/course', isLoggedIn, function(req, res){
		res.render('./course.ejs', { 
				title: 'Course Tackle - ' + req.user.local.firstName + " " + req.user.local.lastName,
		 		user:req.user});
	});

	app.post('/course', function(req, res){
		console.log("in app post");
		process.nextTick(function(){
			var newCourse = new Course();

			newCourse.local.username = req.user.local.username;
			newCourse.local.field = req.body.subject;
			newCourse.local.courseName = req.body.courseName;
			newCourse.local.courseCode = req.body.courseCode;
			newCourse.local.rating = req.body.rating;
			newCourse.local.desc = req.body.desc;

			console.log(newCourse.local.username +" "+newCourse.local.field+" "+newCourse.local.courseName+" "+newCourse.local.courseCode+" "+newCourse.local.rating+" "+newCourse.local.desc);

			newCourse.save(function(err){
				if(err)
					throw err;
				return done(null, newCourse);
			});
			res.redirect('/course/'+newCourse.local.courseCode);
		});

	});

	// Results Page

	app.get('/results', isLoggedIn, function(req, res){
		res.render('./results.ejs', { 
				title: 'Course Tackle - ' + req.user.local.firstName + " " + req.user.local.lastName,
		 		user:req.user});
	});

	// User Page

	app.get('/user', isLoggedIn, function(req, res){
		res.render('./user.ejs', { 
				title: 'Course Tackle - ' + req.user.local.firstName + " " + req.user.local.lastName,
		 		user:req.user});
	});

	//course/csc309 example
	app.get('/course/:courseCode', isLoggedIn, function(req, res){
		
		var courseCode = req.params.courseCode;
		console.log(courseCode);
		console.log(req.user);
		console.log(req.user.local);
		var username = req.user.local.username;

		process.nextTick(function(){
			//var query = Course.find( {'local.courseCode': courseCode} );
			Course.findOne( { 'local.courseCode': courseCode}, function(err, course){
			//query.exec(function(err, reuslts){
				if(err)
					return done(err);
				console.log("+++++++++++++++");
				console.log(course);
				var subject = course.local.field;
				var courseName = course.local.courseName;
				var rating = course.local.rating;
				var desc = course.local.desc;
				var date = course.local.created_at;

				console.log(subject+" "+courseName+" "+
						courseCode+" "+rating+" "+desc+" "+date);

					//return done(null, Course);
					res.render('./course_code.ejs', { 
				title: 'Course Tackle - ' + req.user.local.firstName + " " + req.user.local.lastName,
		 		user:req.user, subject: subject, courseName: courseName, rating: rating, courseCode: courseCode, 
		 		username: username, desc: desc, date: date});
				
			});
		});
	
	});

	// Logout

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

						console.log('BEFORE THE CHANGE' + req.user);
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
									console.log('AFTER THE CHANGE: ' + user);
								}
							})
						})
					}
				db.close();
			})
		res.redirect(req.get('referer'));
	});

	app.get('/left_panel', function(req, res) {
		console.log(req.files);
	  	res.render('./partials/left_panel.ejs', { title: 'ONIX Validator' });
	});
	app.post('/left_panel', function(req, res) {
	  console.log(req.files);
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

