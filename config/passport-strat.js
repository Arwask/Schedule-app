'use strict';

// This module will be executed in app.js.

// module for creating a hash of passwords
const bCrypt = require('bcrypt-nodejs');
const passport = require('passport');

// initialize the passport-local strategy
const { Strategy } = require('passport-local');
let User = null;

// Then define our custom strategies with our instance of the LocalStrategy.

//******************** Registration authetication. Takes two args *************************
const RegistrationStrategy = new Strategy(
	// arg 1: declare what request (req) fields our usernameField and passwordField (passport variables) are.
	{
		usernameField: 'employeeId',
		passwordField: 'password',
		passReqToCallback: true // allows us to pass back the entire request to the callback,
		// which is particularly useful for signing up.
	},
	// arg2 callback, handle storing a user's details.
	(req, employeeId, password, done) => {
		User = req.app.get('models').Employee;

		// add our hashed password generating function inside the callback function
		const generateHash = password => {
			return bCrypt.hashSync(password, bCrypt.genSaltSync(8)); //what is 3rd arg?
		};

		// using the Sequelize user model we initialized earlier as User, we check to see if the user already exists, and if not we add them.
		User.findOne({
			where: { employeeId } // remember, this is object literal shorthand. Same as { email: email}
		}).then(user => {
			if (user) {
				return done(null, false, {
					message: 'That email is already taken'
				});
			} else {
				const userPassword = generateHash(password); //function we defined above
				const data =
					// values come from the req.body, added by body-parser when register form request is submitted
					{
						password: userPassword,
						employeeId: req.body.employeeId,
						firstName: req.body.firstName,
						lastName: req.body.lastName,
						startDate: req.body.startDate,
						email: req.body.email,
						totalHours: req.body.totalHours
					};
				// create() is a Sequelize method
				User.create(data).then(newUser => {
					if (!newUser) {
						return done(null, false);
					}
					if (newUser) {
						// console.log('newUser', newUser);
						return done(null, newUser);
					}
				});
			}
		});
	}
);

// login authentication ****************************************
//LOCAL SIGNIN
const LoginStrategy = new Strategy(
	{
		// by default, local strategy uses username and password, we will override with email
		usernameField: 'employeeId',
		passwordField: 'password',
		passReqToCallback: true // allows us to pass back the entire request to the callback
	},
	(req, employeeId, password, done) => {
		User = req.app.get('models').Employee;
		const isValidPassword = (userpass, password) => {
			// hashes the passed-in password and then compares it to the hashed password fetched from the db
			return bCrypt.compareSync(password, userpass);
		};

		User.findOne({ where: { employeeId } })
			.then(user => {
				if (!user) {
					return done(null, false, {
						message: "Can't find a user with those credentials. Please try again"
					});
				}
				if (req.body.employeeId != user.employeeId) {
					return done(null, false, {
						message: 'Wrong username. Please try again'
					});
				}
				if (!isValidPassword(user.password, password)) {
					return done(null, false, {
						message: 'Incorrect password.'
					});
				}
				const userinfo = user.get();
				return done(null, userinfo);
			})
			.catch(err => {
				// console.log('Error:', err);
				return done(null, false, {
					message: 'Something went wrong with your sign in' + err
				});
			});
	}
);

// Passport has to save a user ID in the session to
// manage retrieving the user details when needed.
// It achieves this with the following two methods:

//serialize. In this function, we will be saving the user id to the session in
// req.session.passport.user
passport.serializeUser((user, done) => {
	// This saves the whole user obj into the session cookie,
	// but typically you will see just user.id passed in.
	done(null, user);
});

// deserialize user
// We use Sequelize's findById to get the user. Then we use the Sequelize getter function, user.get(), to pass a reference to the user to the 'done' function.
passport.deserializeUser(({ id }, done) => {
	User.findById(id).then(user => {
		if (user) {
			done(null, user.get());
		} else {
			done(user.errors, null);
		}
	});
});

// Take the new strategies we just created and use them as middleware, so the http requests get piped through them. A POST to register or login will trigger a strategy, because we will call passport.authenticate in the auth ctrl.
// The first argument is optional and it sets the name of the strategy.
passport.use('local-signup', RegistrationStrategy);
passport.use('local-signin', LoginStrategy);
