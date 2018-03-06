'use strict';

// Common Methods

module.exports.displayIndex = (req, res) => {
  if (res.locals.manager) {
    res.render('manager/index');
  } else if (res.locals.employee) {
    res.render('employee/index');
  } else {
    res.redirect('/login');
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
            attributes: [[sequelize.fn('MAX', sequelize.col('id')), 'lastEmployeeId']]
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
    Employee.create(req.body)
      .then(() => {
        res.redirect('/manager/manage-employee');
      })
      .catch(err => {
        next(err);
      });
  } else {
    let errorMsg = { msg: 'You do not have permission for this route' };
    res.render('errorPage', { errorMsg });
  }
};

module.exports.scheduleGeneraterAlgo = (req, res, next) => {
  if (res.locals.manager == true) {
    const { Employee, Slots, Days, daySlots } = req.app.get('models');
    const managerDept = req.session.passport.user.departmentId;
    let data = {};
    Employee.findAll({
      include: [{ model: daySlots, as: 'employeeAvailId' }],
      where: { departmentId: managerDept }
    }).then(employees => {
      data.employees = employees;
      Slots.findAll().then(slots => {
        // find all slots to fill the dropdowns
        data.slots = slots;
        Days.findAll().then(days => {
          // find all days to fill the Days
          data.days = days;
          daySlots
            .findAll({ attributes: ['id', 'slotId', 'dayId'] })
            .then(eachDaySlots => {
              data.eachDaySlots = eachDaySlots;
              let nextWeek = getDates();
              data.dates = nextWeek;
              res.json(data);
              // res.render('manager/schedule-grid', { data });
            })
            .catch(err => {
              next(err);
            });
        });
      });
    });
  } else {
    let errorMsg = { msg: 'You do not have permission for this route' };
    res.render('errorPage', { errorMsg });
  }
};

module.exports.generateSchedule = (req, res) => {
  res.render('manager/schedule-grid');
};

let getDates = () => {
  let today = new Date();
  let day = today.getDay();
  let nearestSunday = new Date(new Date().getTime() + (7 - day) * 24 * 60 * 60 * 1000);
  let nextWeek = [nearestSunday.toISOString()];
  for (let i = 1; i < 7; i++) {
    nextWeek.push(new Date(nearestSunday.getTime() + i * 24 * 60 * 60 * 1000).toISOString());
  }
  return nextWeek;
};

module.exports.getManagerSchedule = (req, res, next) => {
  if (res.locals.manager == true) {
    const { Employee, Department, Slots, Days, daySlots } = req.app.get('models');
    const managerDept = req.session.passport.user.departmentId;
    let data = {};
    Employee.findAll({ include: [{ model: Department }], where: { departmentId: managerDept } }).then(employees => {
      data.employees = employees;
      Slots.findAll().then(slots => {
        // find all slots to fill the dropdowns
        data.slots = slots;
        Days.findAll().then(days => {
          // find all days to fill the Days
          data.days = days;
          daySlots
            .findAll({ attributes: ['id', 'slotId', 'dayId'] })
            .then(eachDaySlots => {
              data.eachDaySlots = eachDaySlots;
              let nextWeek = getDates();
              data.dates = nextWeek;
              res.render('manager/manager-schedule', { data });
            })
            .catch(err => {
              next(err);
            });
        });
      });
    });
  } else {
    let errorMsg = { msg: 'You do not have permission for this route' };
    res.render('errorPage', { errorMsg });
  }
};
module.exports.postManagerSchedule = (req, res, next) => {
  if (res.locals.manager) {
    const { sequelize } = req.app.get('models');
    let rightNow = new Date().toISOString();
    let output = req.body.slots;
    let currentEmployeeId = req.session.passport.user.id;
    let nextWeek = getDates();
    let sqlQuery =
      'INSERT INTO "schedules" ("employeeScheduleId", "daySlotId", "date", "createdAt", "updatedAt") values';
    output.forEach(op => {
      if (op !== '0') {
        op = op.split(':');
        sqlQuery += `(${currentEmployeeId}, ${op[0]}, '${nextWeek[
          parseInt(op[1]) - 1
        ]}', '${rightNow}', '${rightNow}'),`;
      }
    });
    sqlQuery = sqlQuery.slice(0, -1);
    sequelize
      .query(sqlQuery, { type: sequelize.QueryTypes.INSERT })
      .then(() => {
        res.redirect('/manager/generate-schedule');
      })
      .catch(err => {
        next(err);
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
    Employee.update(empObj, { where: { id: currentEmployeeId } })
      .then(() => {
        res.redirect('/employee/profile');
      })
      .catch(err => {
        next(err);
      });
  } else {
    let errorMsg = { msg: 'You do not have permission to this route' };
    res.render('errorPage', { errorMsg });
  }
};

module.exports.getAvailability = (req, res, next) => {
  if (res.locals.employee == true) {
    let data = {};
    const { daySlots, Days, Slots, sequelize } = req.app.get('models');
    const currentEmployeeId = req.session.passport.user.id;
    sequelize
      .query(
        `SELECT "a"."employeeId", "a"."daySlotId" FROM "Employees" "e" JOIN "availability" "a" ON "e"."id" = "a"."employeeId" AND "e"."id" = '${currentEmployeeId}'`,
        {
          type: sequelize.QueryTypes.INSERT
        }
      )
      .then(employee => {
        // find current employee's availability
        data.employee = employee;
        Slots.findAll().then(slots => {
          // find all slots to fill the dropdowns
          data.slots = slots;
          Days.findAll().then(days => {
            // find all days to fill the Days
            data.days = days;
            daySlots
              .findAll({ attributes: ['id', 'slotId', 'dayId'] })
              .then(eachDaySlots => {
                data.eachDaySlots = eachDaySlots;
                res.render('employee/availability', { data });
              })
              .catch(err => {
                next(err);
              });
          });
        });
      });
  } else {
    let errorMsg = { msg: 'You do not have permission to this route' };
    res.render('errorPage', { errorMsg });
  }
};

module.exports.addAvailability = (req, res, next) => {
  let data = req.body.slots;

  if (res.locals.employee == true) {
    const { sequelize } = req.app.get('models');
    const currentEmployeeId = req.session.passport.user.id;
    let date = new Date().toISOString();
    if (data) {
      let queryString = 'INSERT INTO "availability"("daySlotId", "employeeId", "createdAt", "updatedAt") VALUES';
      if (typeof data == 'string') {
        // if only single availability is added.
        sequelize
          .query(`SELECT * FROM "availability" WHERE "daySlotId" = ${data} AND "employeeId"=${currentEmployeeId}`, {
            type: sequelize.QueryTypes.SELECT
          })
          .then(data => {
            if (data.length == 0) {
              queryString += `('${data}', '${currentEmployeeId}', '${date}', '${date}'),`;
            } else {
              res.redirect('/employee/availability-view');
            }
          });
      } else {
        data.forEach(chunk => {
          if (chunk !== '0') {
            sequelize
              .query(`SELECT * FROM "availability" WHERE "daySlotId" = ${data} AND "employeeId"=${currentEmployeeId}`, {
                type: sequelize.QueryTypes.SELECT
              })
              .then(data => {
                if (data.length == 0) {
                  queryString += `('${chunk}', '${currentEmployeeId}', '${date}', '${date}'),`;
                }
              });
          }
        });
        queryString = queryString.slice(0, -1);
        sequelize
          .query(queryString, {
            type: sequelize.QueryTypes.INSERT
          })
          .then(() => {
            // res.json(data);
          })
          .catch(err => {
            next(err);
          });
      }
      res.redirect('/employee/availability-view');
    }
  } else {
    let errorMsg = { msg: 'You do not have permission to this route' };
    res.render('errorPage', { errorMsg });
  }
};

module.exports.getUserAvailability = (req, res, next) => {
  if (res.locals.employee == true) {
    let data = {};
    const { sequelize, daySlots, Days, Slots } = req.app.get('models');
    const currentEmployeeId = req.session.passport.user.id;
    sequelize
      .query(
        `SELECT "a"."employeeId", "a"."daySlotId" FROM "Employees" "e" JOIN "availability" "a" ON "e"."id" = "a"."employeeId" AND "e"."id" = '${currentEmployeeId}'`,
        {
          type: sequelize.QueryTypes.INSERT
        }
      )
      .then(employee => {
        // find current employee's availability
        data.employee = employee;
        Slots.findAll().then(slots => {
          // find all slots to fill the dropdowns
          data.slots = slots;
          Days.findAll().then(days => {
            // find all days to fill the Days
            data.days = days;
            daySlots
              .findAll({ attributes: ['id', 'slotId', 'dayId'] })
              .then(eachDaySlots => {
                data.eachDaySlots = eachDaySlots;
                // res.json(data);
                res.render('employee/view-availability', { data });
              })
              .catch(err => {
                next(err);
              });
          });
        });
      });
  } else {
    let errorMsg = { msg: 'You do not have permission to this route' };
    res.render('errorPage', { errorMsg });
  }
};

module.exports.removeSingleAvailability = (req, res, next) => {
  if (res.locals.employee == true) {
    const currentEmployeeId = req.session.passport.user.id;
    let slotToRemove = req.params.slotId;

    const { sequelize } = req.app.get('models');
    sequelize
      .query(`DELETE FROM availability WHERE "employeeId"=${currentEmployeeId} AND "daySlotId" = ${slotToRemove}`, {
        type: sequelize.QueryTypes.DELETE
      })
      .then(() => {
        res.redirect('back');
      })
      .catch(err => {
        next(err);
      });
  } else {
    let errorMsg = { msg: 'You do not have permission to this route' };
    res.render('errorPage', { errorMsg });
  }
};
