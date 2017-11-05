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
  editManagerProfile,
  newEmployeeForm,
  addNewEmployee,
  scheduleGrid
} = require('../controllers/employeeCtrl');

const { isManager } = require('../controllers/authCtrl');
//list all employees
router.get('/manager/manage-employee', isLoggedIn, isManager, getDepartmentEmployees);
//list employee details
router.get('/manager/employee-details/:employeeId', isLoggedIn, isManager, getEmployeeDetails);
//employee edit
router.get('/manager/edit-employee/:employeeId', isLoggedIn, isManager, editEmployeeDetailsForm);
router.post('/manager/edit-employee/:employeeId', isLoggedIn, isManager, editEmployeeDetails);
// profile view
router.get('/manager/profile', isLoggedIn, isManager, getManagerData);
router.get('/manager/edit-manager/:managerId', isLoggedIn, isManager, getManagerEditForm);
router.post('/manager/edit-manager/:managerId', isLoggedIn, isManager, editManagerProfile);
// add new employee
router.get('/manager/add-employee', isLoggedIn, isManager, newEmployeeForm);
router.post('/manager/add-employee', isLoggedIn, isManager, addNewEmployee);

//schedule routes
router.get('/manager/generate-schedule', isLoggedIn, isManager, scheduleGrid);

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}
