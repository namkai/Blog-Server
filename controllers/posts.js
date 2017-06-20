const express = require('express');
const posts = express.Router();
const passport = require('passport');
const User = require('../models/user');
const Post = require('../models/posts');

posts.get('/', (req, res) => Post.find({}, (err, posts) => err ? console.log(err) : res.json(posts)));

posts.post('/', ({ user: { _id, name }, body: { title, image, body, description } }, res) => {

	const author = {
		id: _id,
		name,
	};
	const newPost = {
		title,
		image,
		body,
		description,
		author,
	};
	Post.create(newPost, (err, newlyCreated) => err ? console.log(err) : res.json({ newlyCreated }));
});

posts.get('/:id', (req, res) =>
	Post.findById(req.params.id).populate('comments').exec((err, post) =>
		err ? res.send({ err }) : res.send({ post })));

posts.get('/:id/edit', function (req, res) {
	Post.findById(req.params.id, function (err, foundProject) {
		if (err) {
			res.redirect('/projects');
		} else {
			res.render('projects/edit', { project: foundProject });
		}
	});
});

posts.put('/:id', function (req, res) {

	Post.findByIdAndUpdate(req.params.id, req.body.project, function (err, updatedProject) {
		if (err) {
			res.redirect('/projects');
		} else {
			res.redirect('/projects/' + req.params.id);
		}
	});
});

posts.delete('/:id', function (req, res) {
	Post.findByIdAndRemove(req.params.id, function (err) {
		if (err) {
			res.redirect('/projects');
		} else {
			res.redirect('/projects');
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
