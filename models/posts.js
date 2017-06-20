const mongoose = require('mongoose');


const PostSchema = new mongoose.Schema({
	title: String,
	image: String,
	description: String,
	body: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'user',
		},
		username: String,
	},
	comments: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'comment',
	}],
	date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('post', PostSchema);