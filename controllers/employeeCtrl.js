'use strict';

// Common Methods

module.exports.displayIndex = (req, res, next) => {
  if (res.locals.manager) {
    res.render('manager/index');
  } else if (res.locals.employee) {
    res.render('employee/index');
  } else {
    res.render('login');
  }
};

// Manager Methods
module.exports.getDepartmentEmployees = (req, res, next) => {
  if (res.locals.manager == true) {
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
  } else {
    let errorMsg = { msg: 'You do not have permission for this route' };
    res.render('errorPage', { errorMsg });
  }
};

module.exports.getEmployeeDetails = (req, res, next) => {
  const { Employee, Department } = req.app.get('models');
  if (res.locals.manager == true) {
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
  } else {
    let errorMsg = { msg: 'You do not have permission for this route' };
    res.render('errorPage', { errorMsg });
  }
};

module.exports.editEmployeeDetailsForm = (req, res, next) => {
  const { Employee, Department, sequelize } = req.app.get('models');
  const data = {};
  if (res.locals.manager == true) {
    Department.findAll()
      .then(Departments => {
        data.depts = Departments;
        Employee.findAll({
          attributes: [[sequelize.fn('DISTINCT', sequelize.col('jobTitle')), 'jobTitle']]
        }).then(titles => {
          data.jobTitle = titles;
          Employee.findOne({
            include: [{ model: Department }],
            where: { id: req.params.employeeId }
          }).then(employee => {
            data.employee = employee;
            // res.json(data);
            res.render('manager/employee-edit-form', { data });
          });
        });
      })
      .catch(err => {
        next(err);
      });
  } else {
    let errorMsg = { msg: 'You do not have permission for this route' };
    res.render('errorPage', { errorMsg });
  }
};

module.exports.editEmployeeDetails = (req, res, next) => {
  const { Employee } = req.app.get('models');
  if (res.locals.manager == true) {
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
  } else {
    let errorMsg = { msg: 'You do not have permission for this route' };
    res.render('errorPage', { errorMsg });
  }
};

module.exports.getManagerData = (req, res, next) => {
  if (res.locals.manager == true) {
    const managerId = req.session.passport.user.id;
    const { Employee, Department } = req.app.get('models');
    Employee.findOne({ include: [{ model: Department }], where: { id: managerId } })
      .then(manager => {
        res.render('manager/profile', { manager });
      })
      .catch(err => {
        next(err);
      });
  }
};

module.exports.getManagerEditForm = (req, res, next) => {
  if (res.locals.manager == true) {
    const { Employee, Department, sequelize } = req.app.get('models');
    const data = {};
    Department.findAll()
      .then(Departments => {
        data.depts = Departments;
        Employee.findAll({
          attributes: [[sequelize.fn('DISTINCT', sequelize.col('jobTitle')), 'jobTitle']]
        }).then(titles => {
          data.jobTitle = titles;
          Employee.findOne({
            include: [{ model: Department }],
            where: { id: req.params.managerId }
          }).then(employee => {
            data.employee = employee;
            res.render('manager/profile-edit', { data });
          });
        });
      })
      .catch(err => {
        next(err);
      });
  } else {
    let errorMsg = { msg: 'You do not have permission for this route' };
    res.render('errorPage', { errorMsg });
  }
};

module.exports.editManagerProfile = (req, res, next) => {
  if (res.locals.manager == true) {
    const { Employee } = req.app.get('models');
    let managerObj = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      dob: req.body.dob,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      totalHours: req.body.totalHours,
      notes: req.body.notes,
      ecFirstName: req.body.ecFirstName,
      ecLastName: req.body.ecLastName,
      ecPhoneNumber: req.body.ecPhoneNumber
    };
    Employee.update(managerObj, { where: { id: req.params.managerId } })
      .then(() => {
        // console.log(req.paarams.employeeId);
        res.redirect(`/manager/profile`);
      })
      .catch(err => {
        next(err);
      });
  } else {
    let errorMsg = { msg: 'You do not have permission for this route' };
    res.render('errorPage', { errorMsg });
  }
};

module.exports.newEmployeeForm = (req, res, next) => {
  if (res.locals.manager == true) {
    const { Employee, Department, sequelize } = req.app.get('models');
    const data = {};
    Department.findAll()
      .then(Departments => {
        data.depts = Departments;
        Employee.findAll({
          attributes: [[sequelize.fn('DISTINCT', sequelize.col('jobTitle')), 'jobTitle']]
        }).then(titles => {
          data.jobTitle = titles;
          Employee.findOne({
            attributes: [[sequelize.fn('MAX', sequelize.col('employeeId')), 'lastEmployeeId']]
          }).then(empId => {
            let randomNumber = Math.floor(Math.random() * 5 + 1);
            const lastId = empId.dataValues.lastEmployeeId;
            data.newEmployeeId = parseInt(lastId) + parseInt(randomNumber);
            res.render('manager/new-employee-form', { data });
          });
        });
      })
      .catch(err => {
        next(err);
      });
  } else {
    let errorMsg = { msg: 'You do not have permission for this route' };
    res.render('errorPage', { errorMsg });
  }
};

module.exports.addNewEmployee = (req, res, next) => {
  if (res.locals.manager == true) {
    const { Employee } = req.app.get('models');
    Employee.create(req.body).then(() => {
      res.redirect('/manager/manage-employee');
    });
  } else {
    let errorMsg = { msg: 'You do not have permission for this route' };
    res.render('errorPage', { errorMsg });
  }
};

// Employee Methods

module.exports.getEmployeeProfile = (req, res, next) => {
  if (res.locals.employee == true) {
    const currentEmployeeId = req.session.passport.user.id;
    const { Employee, Department } = req.app.get('models');
    Employee.findOne({ include: [{ model: Department }], where: { id: currentEmployeeId } })
      .then(employee => {
        // res.json(employee);
        res.render('employee/profile', { employee });
      })
      .catch(err => {
        next(err);
      });
  } else {
    let errorMsg = { msg: 'You do not have permission to this route' };
    res.render('errorPage', { errorMsg });
  }
};

module.exports.getProfileEditForm = (req, res, next) => {
  if (res.locals.employee == true) {
    const currentEmployeeId = req.session.passport.user.id;
    const { Employee, Department } = req.app.get('models');
    Employee.findOne({ include: [{ model: Department }], where: { id: currentEmployeeId } })
      .then(employee => {
        // res.json(employee);
        res.render('employee/edit-profile-form', { employee });
      })
      .catch(err => {
        next(err);
      });
  } else {
    let errorMsg = { msg: 'You do not have permission to this route' };
    res.render('errorPage', { errorMsg });
  }
};

module.exports.editProfile = (req, res, next) => {
  if (res.locals.employee == true) {
    const currentEmployeeId = req.session.passport.user.id;
    const { Employee } = req.app.get('models');
    let empObj = {
      dob: req.body.dob,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      ecFirstName: req.body.ecFirstName,
      ecLastName: req.body.ecLastName,
      ecPhoneNumber: req.body.ecPhoneNumber
    };
    Employee.update(empObj, { where: { id: currentEmployeeId } }).then(() => {
      res.redirect('/employee/profile');
    });
  }
};
