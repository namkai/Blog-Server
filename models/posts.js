const mongoose = require('mongoose');


const PostSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	project: String,
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
});

module.exports = mongoose.model('post', PostSchema);