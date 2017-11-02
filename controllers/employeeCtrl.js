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

module.exports.editEmployeeDetails = (req, res, next) => {
  const { Employee, Department } = req.app.get('models');
  Employee.findOne({ include: [{ model: Department }], where: { id: req.params.employeeId } })
    .then(employee => {
      res.render('manager/employee-edit-form', { employee });
    })
    .catch(err => {
      next(err);
    });
};
