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
  scheduleGrid,
  getManagerSchedule,
  postManagerSchedule,
  generateSchedule,
  scheduleGeneraterAlgo,
  makeSchedule,
  displaySchedule
} = require('../controllers/managerCtrl');

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
router.post('/manager/add-employee/:employeeId', isLoggedIn, isManager, addNewEmployee);

//schedule routes
router.get('/manager/manager-schedule', isLoggedIn, isManager, getManagerSchedule); //form for schedule
router.post('/manager/manager-schedule', isLoggedIn, isManager, postManagerSchedule); // posting the manager schedule
router.get('/manager/generate-schedule', isLoggedIn, isManager, generateSchedule); // generate button page
router.get('/manager/edit-schedule', isLoggedIn, isManager, scheduleGrid);
router.get('/manager/schedule', isLoggedIn, isManager, scheduleGeneraterAlgo);
router.post('/manager/schedule', isLoggedIn, isManager, makeSchedule);
router.get('/manager/view-schedule', isLoggedIn, isManager, displaySchedule);

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}
