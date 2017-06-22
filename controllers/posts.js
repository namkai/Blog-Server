const express = require('express');
const posts = express.Router({ mergeParams: true });
const passport = require('passport');
const User = require('../models/user');
const Post = require('../models/posts');
const comments = require('../controllers/comments');


posts.use('/:id/comments', comments);

posts.get('/', (req, res) => Post.find({}).populate('comments').exec((err, posts) =>
	err ? res.send({ err }) : res.json({ posts })));
//	Post.find({}, (err, posts) => err ? console.log(err) : res.json(posts)));

posts.post('/', ({ body }, res) =>
	Post.create(body, (err, newlyCreated) => err ? console.log(err) : res.json(newlyCreated)));

posts.get('/:id', (req, res) =>
	Post.findById(req.params.id).populate('comments').exec((err, post) =>
		err ? res.send({ err }) : res.send({ post })));

posts.put('/:id', function (req, res) {
	Post.findByIdAndUpdate(req.params.id, req.body, function (err, updatedProject) {
		if (err) {
			res.send({ err });
		} else {
			Post.find({}).populate('comments').exec((err, posts) =>
				err ? res.send({ err }) : res.json({ posts }));
		}
	});
});

posts.delete('/:id', function (req, res) {
	Post.findByIdAndRemove(req.params.id, function (err) {
		if (err) {
			res.send({ err });
		} else {
			Post.find({}).populate('comments').exec((err, posts) =>
				err ? res.send({ err }) : res.json({ posts }));
		}
	});
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.redirect('/login');
	}
}

module.exports = posts;
