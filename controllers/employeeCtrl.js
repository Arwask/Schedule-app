'use strict';

module.exports.getDepartmentEmployees = (req, res, next) => {
  const { Employee, Department } = req.app.get('models');
  const managerDept = req.session.passport.user.departmentId;
  Employee.findAll({
    include: [{ model: Department }],
    where: {
      departmentId: managerDept
    }
  })
    .then(employees => {
      // res.json(employees);
      res.render('manager/display-employees', { employees });
    })
    .catch(err => {
      next(err);
    });
};

module.exports.getEmployeeDetails = (req, res, next) => {
  const { Employee, Department } = req.app.get('models');
  Employee.findOne({
    include: [{ model: Department }],
    where: { id: req.params.employeeId }
  })
    .then(employee => {
      res.render('manager/employee-details', { employee });
    })
    .catch(err => {
      next(err);
    });
};

module.exports.editEmployeeDetailsForm = (req, res, next) => {
  const { Employee, Department, sequelize } = req.app.get('models');
  const data = {};
  Department.findAll()
    .then(Departments => {
      data.depts = Departments;
      Employee.findAll({
        attributes: [[sequelize.fn('DISTINCT', sequelize.col('jobTitle')), 'jobTitle']]
      }).then(titles => {
        data.jobTitle = titles;
        Employee.findOne({ include: [{ model: Department }], where: { id: req.params.employeeId } }).then(employee => {
          data.employee = employee;
          // res.json(data);
          res.render('manager/employee-edit-form', { data });
        });
      });
    })
    .catch(err => {
      next(err);
    });
};

module.exports.editEmployeeDetails = (req, res, next) => {
  const { Employee } = req.app.get('models');
  if (req.body.endDate === '') {
    req.body.endDate = null;
  }
  let empObj = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    dob: req.body.dob,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    departmentId: req.body.department,
    jobTitle: req.body.jobTitle,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    totalHours: req.body.totalHours,
    notes: req.body.notes
  };
  Employee.update(empObj, {
    where: { id: req.params.employeeId }
  })
    .then(() => {
      // console.log(req.paarams.employeeId);
      res.redirect(`/manager/manage-employee`);
    })
    .catch(err => {
      next(err);
    });
};
