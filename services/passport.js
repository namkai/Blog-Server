const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const { Strategy, ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local');


// Create local strategy
// Verify this email and password, call done with the user
// if it is the correct email and password otherwise, call done with false
const localLogin = new LocalStrategy({ usernameField: 'email' }, (email, password, done) =>
	User.findOne({ email }, (err, user) =>
		err ? done(err) : !user ? done(null, false) :
			user.comparePassword(password, (err, isMatch) =>
				err ? done(err) : !isMatch ? done(null, false) : done(null, user))));


// Setup options for JWT Strategy
const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromHeader('authorization'),
	secretOrKey: config.secret,
};

// Create JWT Strategy
// See if the user ID in the payload exists in our database
// If it does, call 'done' with that user
// Otherwise, call done without a user object
const jwtLogin = new Strategy(jwtOptions, (payload, done) =>
	User.findById(payload.sub, (err, user) =>
		err ? done(err, false) : user ? done(null, user) : done(null, false)));


// Tell passport to use this strategy

passport.use(jwtLogin);
passport.use(localLogin);
