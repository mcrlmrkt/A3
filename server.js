var express = require('express');
var app = express();
var port = process.env.PORT || 9500;
var path = require('path');
var multer = require('multer');
var test = false;

var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');
var util = require('util');
var formidable = require('formidable');
var fs = require('fs-extra');

var configDB = require('./config/database.js');
mongoose.connect(configDB.url);
require('./config/passport')(passport);
//require('./config/wallPost');

//CONFIGURE MULTER
// app.use(multer({dest: './uploads/'}).single('dp'), function(req, res, next){
//    console.log('is this undefined');
//  });

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({secret: 'anystringoftext',
				 saveUninitialized: true,
				 save: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//require('./config/settings')(passport);
require('./app/routes.js')(app, passport);

app.listen(port);
console.log('Server running on port: ' + port);
