const express = require('express');
const comments = express.Router({ mergeParams: true });
const Posts = require('../models/posts');
const Comment = require('../models/comment');
const User = require('../models/user');


comments.post('/', function (req, res) {
	Posts.findById(req.params.id, function (err, project) {
		if (err) {
			res.send({ err });
		} else {
			Comment.create(req.body.comment, function (err, comment) {
				if (err) {
					res.send({ err });
				} else {
					comment.author.id = req.body.user._id;
					comment.author.name = req.body.user.name;
					comment.save();
					project.comments.push(comment);
					project.save();
					res.send({ project });
				}
			});
		}
	});
});

module.exports = comments;