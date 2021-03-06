'use strict';
const passport = require('passport');

/** @module Authentication Controller */

/**
 * Render the register form to allow users to register
 */
module.exports.displayRegister = (req, res) => {
	res.render('register');
};

/**
 * Controller to handle new user registration
 */
module.exports.register = (req, res, next) => {
	if (req.body.password === req.body.confirmation) {
		// console.log('Trying to register new user!!!!!');
		// first argument is name of the passport strategy we created in passport-strat.js
		passport.authenticate('local-signup', (err, user, msgObj) => {
			// console.log('Where are we? session.js', user);
			if (err) {
				next(err);
			} //or return next(err)
			if (!user) {
				return res.render('register', msgObj);
			}
			// Go ahead and login the new user once they are signed up
			req.logIn(user, err => {
				if (err) {
					return next(err);
				}
				// console.log('authenticated. Rerouting to welcome page!');
				// Save a msg in a cookie whose value will be added to req
				// using https://www.npmjs.com/package/express-flash-2 docs, but installed express-flash
				req.flash('registerMsg', `Thanks for signing up, ${user.firstName}!`);
				res.redirect('/');
			});
		})(req, res, next);
	} else {
		res.render('register', {
			message: 'Password & password confirmation do not match'
		});
	}
};

// logging in existing users
/**
 * Controller method to render the login form page
 */
module.exports.displayLogin = (req, res) => {
	res.render('partials/login-form');
};

/**
 * Controller method to handle the login form post
 */
module.exports.login = (req, res, next) => {
	// Note we're using different strategy, this time for logging in
	passport.authenticate('local-signin', (err, user, msgObj) => {
		// If login fails, the error is sent back by the passport strategy as { message: "some msg"}
		if (err) {
			next(err);
		} //or return next(err) once handler set up in app.js
		if (!user) {
			return res.render('../views/partials/login-form', msgObj);
		}
		req.logIn(user, err => {
			if (err) {
				return next(err);
			}
			// console.log('authenticated. Rerouting to welcome!', user);
			req.flash('welcomeBackMsg', `Welcome back, `);
			res.redirect('/welcome');
		});
	})(req, res, next);
};

module.exports.welcome = (req, res) => {
	res.render('partials/login-form');
};

module.exports.isManager = (req, res, next) => {
	res.locals.employee = false;
	res.locals.manager = false;
	if (req.session.passport.user.jobTitle == 'manager') {
		res.locals.manager = true;
		return next();
	} else if (req.session.passport.user.jobTitle == 'part-time' || req.session.passport.user.jobTitle == 'full-time') {
		res.locals.employee = true;
		return next();
	} else res.render('../partials/login');
};

/**
 * Controller method to handle the logout click, destroy the session, and redirect users to the home page
 */
module.exports.logout = (req, res) => {
	req.session.destroy(function(err) {
		if (!err) res.redirect('/');
	});
};

module.exports.changePassword = (req, res) => {
	res.render('change-password');
};

module.exports.savePassword = (req, res) => {
	// const userPassword = req.session.passport.user.password;
	// const userId = req.session.passport.user.id;
	// console.log(userPassword, userId);
	res.json(req.body);
};
