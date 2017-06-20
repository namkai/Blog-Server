const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');
const posts = require('./controllers/posts');
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = (app) => {
	app.get('/', requireAuth, (req, res) => res.json({user: req.user}));
	app.post('/signin', requireSignin, Authentication.signin);
	app.post('/signup', Authentication.signup);
	app.use('/posts', posts);
};
