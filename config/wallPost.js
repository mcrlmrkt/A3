var User = require('../app/models/user');
var wallPost = require('../app/models/wallPosts');
var util = require('util');


module.exports = {
    postNew: function(req, res) {
    	var newPost = wallPost();

    	newPost.post.to_user = req.body.username_display;
    },
    login: function(req, res){
        /*do somethings*/
    },
    logout: function(req, res){
        /*do somethings*/
    }
};