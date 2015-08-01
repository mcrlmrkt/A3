var express = require('express');
var app = express();
var port = process.env.PORT || 9510;
var path = require('path');

var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');

var configDB = require('./config/database.js');
mongoose.connect(configDB.url);
require('./config/passport')(passport);

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

function signInCallback(authResult) {
  if (authResult.code) {
    $.post('/auth/google/callback', { code: authResult.code})
    .done(function(data) {
      $('#signinButton').hide();
    }); 
  } else if (authResult.error) {
    console.log('There was an error: ' + authResult.error);
  }
};

app.set('view engine', 'ejs');

require('./app/routes.js')(app, passport);

app.listen(port);
console.log('Server running on port: ' + port);




