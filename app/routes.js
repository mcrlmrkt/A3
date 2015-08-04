var User = require('./models/user');
var FriendList = require('./models/friend');
var FriendReq = require('./models/friendReq');
var Course = require('./models/course');
var wallPost = require('../app/models/wallPosts');
var mongodb = require('mongodb').MongoClient;
var url = require('url');

// Connect to the db
mongodb.connect('mongodb://Muhsanah:csc309sanah@ds061158.mongolab.com:61158/coursetackle', function(err, db) {
  if(!err) {
    console.log("We are connected");
  }
});

module.exports = function(app, passport){
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
  		res.redirect('back');
	});
	app.get('/newsfeed', isLoggedIn, function(req, res, next) {
		console.log(req.files);
		var flist = null;
		mongodb.connect('mongodb://Muhsanah:csc309sanah@ds061158.mongolab.com:61158/coursetackle', function(err, db) {
			if(!err) {
			   console.log("We are connected");
			}
			FriendList.find({'username' : req.user.local.username }, function(err, friendlist) {
				console.log(req.user.local.username);
				if(friendlist){
					flist = friendlist;
					console.log("My Flist outside is : " + flist);
					res.render('./newsfeed.ejs', 
						{	title: 'Course Tackle -` News Feed',
					 		user: req.user,
					 		friendlist: flist,
					 		photo: '/images/'+ req.user.local.username + '.jpg' });
				}
			});
		});

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
		var flist = null;
		var gusername = "";
		mongodb.connect('mongodb://Muhsanah:csc309sanah@ds061158.mongolab.com:61158/coursetackle', function(err, db) {
			if(!err) {
			   console.log("We are connected");
			}
			gusername = req.user.local.username;
			FriendList.find({'username' : req.user.local.username }, function(err, friendlist) {
				if(friendlist){
					wallPost.find({'post.to_user': req.user.local.username}, {'post.from_user': 1, 'post.wall_post': 1, _id: 0}, function(err, posts){
					if (err){
						console.log('there was an error finding posts to ' + req.user.local.username);
						throw err;
					} if (posts) {
						console.log('testing posts ' + posts);
						res.render('./profile.ejs', { 
							title: 'Course Tackle - ' + req.user.local.firstName + " " + req.user.local.lastName,
					 		user: req.user,
					 		entries: posts,
					 		friendlist: friendlist,
					 		photo: '/images/'+ gusername + '.jpg' });
						}
					});
			}});
			
		});
	});

	// Course page

	app.get('/course', isLoggedIn, function(req, res){
		var flist = null;
		mongodb.connect('mongodb://Muhsanah:csc309sanah@ds061158.mongolab.com:61158/coursetackle', function(err, db) {
			if(!err) {
			   console.log("We are connected");
			}
			FriendList.find({'username' : req.user.local.username }, function(err, friendlist) {
				if(friendlist){
					res.render('./course.ejs', 
					{	title: 'Course Tackle - ' + req.user.local.firstName + " " + req.user.local.lastName,
				 		user: req.user,
		 				friendlist: friendlist,
		 				photo: '/images/'+ req.user.local.username.toString() + '.jpg'  });
				}
			});
		});
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
		 		user:req.user,
		 	photo: '/images/'+ req.user.local.username + '.jpg' });
	});



	//course/csc309 example
	app.get('/course/:courseCode', isLoggedIn, function(req, res){
		
		var courseCode = req.params.courseCode;
		console.log(courseCode);
		console.log(req.user);
		console.log(req.user.local);
		var username = req.user.local.username;

		process.nextTick(function(){
			mongodb.connect('mongodb://Muhsanah:csc309sanah@ds061158.mongolab.com:61158/coursetackle', function(err, db) {
				if(!err) {
				   console.log("We are connected");
				}
				FriendList.find({'username' : req.user.local.username }, function(err, friendlist) {
					if(friendlist){
						//var query = Course.find( {'local.courseCode': courseCode} );
						Course.find( { 'local.courseCode': courseCode}, function(err, courselist){
						//query.exec(function(err, reuslts){
							if(err)
								return done(err);
							console.log("+++++++++++++++");
							console.log(courselist);

							/*if (course == null) { //if couldn't find coursecode in db
								var collection = Course.find({'local.username': req.user.local.username});
								console.log(collection);
								res.render('./course.ejs', { 
									title: 'Course Tackle - ' + req.user.local.firstName + " " + req.user.local.lastName,
					 				user:req.user, collection: collection, friendlist: friendlist});
							}
							else {
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
					 					username: username, desc: desc, date: date, friendlist: friendlist});*/
								res.render('./course_code.ejs', { 
										title: 'Course Tackle - ' + req.user.local.firstName + " " + req.user.local.lastName,
					 					user:req.user, courseCode: courseCode, 
					 					username: username, friendlist: friendlist, courselist: courselist});

							
						});
					}
				});
			});

			
		});
	
	});

	app.post('/course/:courseCode', function(req, res){
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
	

	// Logout

	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});

	// FriendReq page

	app.get('/friendRequest', isLoggedIn, function(req, res){
		mongodb.connect('mongodb://Muhsanah:csc309sanah@ds061158.mongolab.com:61158/coursetackle', function(err, db) {
			if(!err) {
			   console.log("We are connected");
			}
			FriendList.find({'username' : req.user.local.username }, function(err, friendlist) {
				console.log(req.user.local.username);
				if(friendlist){
					FriendReq.find({'pendingFriend': req.user.local.username }, function(err, freq){
						if(err)
							return done(err);
						if(freq){ // exists unanswered requests
							console.log("List of friend requests");
							res.render('./friendRequest.ejs', { 
									title: 'Course Tackle - ' + req.user.local.firstName + " " + req.user.local.lastName,
							 		friendsreqs: freq,
							 		friendlist: friendlist,
							 		user:req.user,
							 		photo: '/images/' + req.user.local.username + '.jpg'});
						} else { // no requests exist
							console.log("No friend Requests");
							res.render('./friendRequest.ejs', { 
									title: 'Course Tackle - ' + req.user.local.firstName + " " + req.user.local.lastName,
							 		friendreqs: null,
							 		friendlist: friendlist,
							 		user:req.user,
							 		photo: '/images/' + req.user.local.username + '.jpg'});
						}
					});
				}
			});
		});


	});

	// add friend
	app.post('/addFriend', isLoggedIn, function(req, res) {
		mongodb.connect('mongodb://Muhsanah:csc309sanah@ds061158.mongolab.com:61158/coursetackle', function(err, db) {
			if(!err) {
			   console.log("We are connected");
			}
			if (req.body) {
				console.log(req.body);
				var newReq = new FriendReq();
				newReq.username = req.body.reqUser;
				newReq.pendingFriend = req.body.fUsername;
				newReq.save(function(err){
					if(err) {
						console.log("new req insert error");
						throw err;
					}
				});
				newReq.username = req.body.fUsername;
				newReq.pendingFriend = req.body.reqUser;
				newReq.save(function(err){
					if(err) {
						console.log("new req insert error");
						throw err;
					}
				});
			}
		});
		res.redirect('back');
	});

	app.get('/replyFriend', isLoggedIn, function(req, res) {
		mongodb.connect('mongodb://Muhsanah:csc309sanah@ds061158.mongolab.com:61158/coursetackle', function(err, db) {
			if(!err) {
			   console.log("We are connected");
			}
			if (req.body) {
				var url_parts = url.parse(req.url, true);
				var query = url_parts.query;
				if (query.reply === "Yes") {
					var newFriend = new FriendList();
					newFriend.username = query.username;
					newFriend.friend = query.pending;
					newFriend.save(function(err){
						if(err) {
							console.log("Friend Insert Failed");
							throw err;
						}
					});
				}
				FriendReq.remove({ 'username':query.username, 'pendingFriend': query.pending});
				FriendReq.remove({ 'username':query.pending, 'pendingFriend': query.username});
				console.log("Replying to friends");
			}
		});
		res.redirect('back');
	});

	app.post('/friendReq', function(req, res){
		mongodb.connect('mongodb://Muhsanah:csc309sanah@ds061158.mongolab.com:61158/coursetackle', function(err, db) {
			if(!err) {
			   console.log("We are connected");
			}
			if (req.body) {

			}
		});
	});

	app.post('/newsfeed', function(req, res, done){
			if(req.user){
						var newPassword = req.body.settings_password;
						var newFirstName = req.body.settings_firstName;
						var newLastName = req.body.settings_lastName;
						var newField = req.body.settings_field;
						var newEmail = req.body.settings_email;

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
			res.redirect('back');
	});


	app.post('/user/:username', isLoggedIn, function(req, res){
		
		var to_user = req.params.username;
		console.log('to_user is ' + to_user);
		var username = req.user.local.username;
		var user = User.findOne({'local.username': to_user});
		console.log('user is ' + user);

		User.findOne({'local.username': to_user}, function(err, user){
			if (err){
				console.log('user not found');
				throw err;
			} else {
				var newPost = wallPost();

				newPost.post.to_user = to_user;
				newPost.post.from_user = req.user.local.username;
				console.log('from_user is ' + req.user.local.username);
				newPost.post.wall_post = req.body.wall_entry;
				console.log('wall entry is ' + req.body.wall_entry);
				newPost.save(function(err){
						if(err){
							console.log('post save error');
							throw err;
						}
						else {
							console.log('post is saved');
							return done(null, newPost);
						}
			});
		}
	});
			res.redirect('back');	
	});

	// // User Page
	app.get('/user/:username', isLoggedIn, function(req, res){
		mongodb.connect('mongodb://Muhsanah:csc309sanah@ds061158.mongolab.com:61158/coursetackle', function(err, db) {
			User.findOne({'local.username': req.params.username}, function(err, user){
				if(err){
					console.log('cant find user/:username app.get');
					throw err;
				} else {		
				console.log('username is ' + req.params.username);
				wallPost.find({'post.to_user': req.params.username}, {'post.from_user': 1, 'post.wall_post': 1, _id: 0}, function(err, posts){
					if (err){
						console.log('there was an error finding posts to ' + req.params.username);
						throw err;
					} if (posts) {
						console.log('testing posts ' + posts);
						res.render('./user.ejs', { 
							title: 'Course Tackle - ' + req.user.local.firstName + " " + req.user.local.lastName,
					 		user: user,
					 		test: '/user/' + req.params.username,
					 		entries: posts,
					 		photo: '/images/'+ req.params.username + '.jpg' });
						}
					});
				}
			});
		});
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

