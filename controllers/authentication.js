const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user) {
	const timestamp = new Date().getTime();
	return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

// User has already had their email and password auth'd
// We just need to give them a token
exports.signin = (req, res) => res.send({ token: tokenForUser(req.user) });


exports.signup = ({ body: { name, email, password, profilePhoto, backgroundPhoto } }, res, next) => {
	if (!name || !email || !password) {
		return res.status(422).send({ error: 'You must provide username, email and password' });
	}

	// See if a user with the given email exists
	User.findOne({ email }, (err, existingUser) => {
		if (err) { return next(err);}

		// If a user with email does exist, return an error
		if (existingUser) {
			return res.status(422).send({ error: 'Email is in use' });

		}
		// If a user with email does NOT exist, create and save user record
		const user = new User({
			name,
			email,
			password,
			profilePhoto,
			backgroundPhoto,
		});

		user.save(err => err ? next(err) : res.json({ token: tokenForUser(user) }));
		// Respond to request indicating the user was create
	});
};