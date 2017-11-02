'use strict';

const { Router } = require('express');
const router = Router();

const { getDepartmentEmployees, getEmployeeDetails, editEmployeeDetails } = require('../controllers/employeeCtrl');

router.get('/manager/manage-employee', isLoggedIn, getDepartmentEmployees);

router.get('/manager/employee-details/:employeeId', isLoggedIn, getEmployeeDetails);

router.get('/manager/edit-employee/:employeeId', isLoggedIn, editEmployeeDetails);
module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}
