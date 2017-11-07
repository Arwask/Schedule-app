'use strict';

const { Router } = require('express');
const router = Router();
// const
const { displayLogin, login, logout, isManager } = require('../controllers/authCtrl.js');

const { displayIndex } = require('../controllers/employeeCtrl');
// login existing users
router.get('/login', displayLogin);
router.post('/login', login);

router.get('/welcome', isLoggedIn, isManager, displayIndex);
router.post('/logout', logout);

// We add this to the welcome route as an additional step to take before calling
// the controller's 'welcome' method. 'isAuthenticated' is added to the request obj
// If there is a user, then all is well and we call `next()` to move on to the next
// middleware function ( welcome() ). If not, take 'em back to the login page'
// by passport. Coolness
// NOTE that we don't need to export this function. Why?
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}

module.exports = router;
