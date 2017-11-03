'use strict';

const { Router } = require('express');
const router = Router();

const { getEmployeeProfile, getProfileEditForm, editProfile, getAvailability } = require('../controllers/employeeCtrl');

const { isManager } = require('../controllers/authCtrl');

// employee profile routes
router.get('/employee/profile', isLoggedIn, isManager, getEmployeeProfile);
router.get('/employee/edit-profile', isLoggedIn, isManager, getProfileEditForm);
router.post('/employee/edit-profile', isLoggedIn, isManager, editProfile);

// employee availability routes
router.get('/employee/availability', isLoggedIn, isManager, getAvailability);
module.exports = router;
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}
