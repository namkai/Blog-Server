const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt-nodejs');

// Define our model

const userSchema = new Schema({
	name: String,
	email: { type: String, unique: true, lowercase: true },
	password: String,
	profilePhoto: String,
	backgroundPhoto: String,
});

// On Save Hook, encrypt password
userSchema.pre('save', function (next) {
	// Get access to the user model
	const user = this;
	// Generate a salt then run callback
	bcrypt.genSalt(10, (err, salt) =>
		err ? next(err) :
			// Hash (encrypt) our password using the salt
			bcrypt.hash(user.password, salt, null, (err, hash) => {
				err ? next(err) :
					// Overwrite plain text password with encrypted password
					user.password = hash;
				next();
			}));
});

userSchema.methods.comparePassword = function (candidatePassword, callback) {
	bcrypt.compare(candidatePassword, this.password, (err, isMatch) =>
		err ? callback(err) : callback(null, isMatch));
};

// Create the model class
const User = mongoose.model('user', userSchema);


// Export the model

module.exports = User;

