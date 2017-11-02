'use strict';

const { Router } = require('express');
const router = Router();

const {
  getDepartmentEmployees,
  getEmployeeDetails,
  editEmployeeDetails,
  editEmployeeDetailsForm,
  getManagerData,
  getManagerEditForm,
  editManagerProfile
} = require('../controllers/employeeCtrl');
//list all employees
router.get('/manager/manage-employee', isLoggedIn, getDepartmentEmployees);
//list employee details
router.get('/manager/employee-details/:employeeId', isLoggedIn, getEmployeeDetails);
//employee edit
router.get('/manager/edit-employee/:employeeId', isLoggedIn, editEmployeeDetailsForm);
router.post('/manager/edit-employee/:employeeId', isLoggedIn, editEmployeeDetails);
// profile view
router.get('/manager/profile', isLoggedIn, getManagerData);
router.get('/manager/edit-manager/:managerId', isLoggedIn, getManagerEditForm);
router.post('/manager/edit-manager/:managerId', isLoggedIn, editManagerProfile);
module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}
