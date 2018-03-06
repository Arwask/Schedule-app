'use strict';

// ------------ GET EMPLOYEES FROM SAME DEPT AS MANAGER -------------
module.exports.getDepartmentEmployees = (req, res, next) => {
	if (res.locals.manager == true) {
		const { Employee, Department } = req.app.get('models');
		const managerDept = req.session.passport.user.departmentId;
		Employee.findAll({
			include: [{ model: Department }],
			where: {
				departmentId: managerDept,
				endDate: null
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

// ------------ GET EMPLOYEE'S DETAILS ----------

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

// ------------------ EDIT EMPLOYEE DETAILS FORM DISPLAY-----------------

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

//----------------EDIT EMPLOYEE DETAILS ------------

module.exports.editEmployeeDetails = (req, res, next) => {
	const { Employee } = req.app.get('models');
	if (res.locals.manager == true) {
		if (req.body.endDate === '') {
			req.body.endDate = null;
		} else {
			req.body.endDate = req.body.endDate.slice(0, 10);
		}
		if (req.body.dob === '') {
			req.body.dob = null;
		} else {
			req.body.dob = req.body.dob.slice(0, 10);
		}
		if (req.body.totalHours === '') {
			req.body.totalHours = null;
		}
		let empObj = {
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			dob: req.body.dob,
			phoneNumber: req.body.phoneNumber,
			email: req.body.email,
			departmentId: req.body.department,
			jobTitle: req.body.jobTitle,
			startDate: req.body.startDate.slice(0, 10),
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

// ------ GET MANAGER'S PROFILE DATA-----------------

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

//------ GET FORM TO EDIT MANAGER DATA-----------

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

// ------------SAVE EDITED PROFILE DATA ---------------

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

//-----------ADD NEW EMPLOYEE IN THE DEAPRTMENT'S FORM-----------

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
						data.employeeId = parseInt(lastId) + parseInt(randomNumber);
						// res.json(data);
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

//-------------SAVE NEW EMPLOYEE'S DATA-------------

module.exports.addNewEmployee = (req, res, next) => {
	if (res.locals.manager == true) {
		req.body.employeeId = req.params.employeeId;
		req.body.password = '$2a$08$s69SaSkA.ygyFX7XU5yHg.RJjzPGmbF3/yWPnedQRsjwEQmy3DHZ6';
		// res.json(req.body);
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

//------------ SCHEDULE GRID DISPLAY FOR EDIT--------------------

module.exports.scheduleGrid = (req, res, next) => {
	if (res.locals.manager == true) {
		const { Employee, Department, Slots, Days, daySlots, sequelize } = req.app.get('models');
		const managerDept = req.session.passport.user.departmentId;
		let data = {};
		Employee.findAll({ include: [{ model: Department }], where: { departmentId: managerDept } }).then(employees => {
			data.employees = employees;
			Slots.findAll()
				.then(slots => {
					// find all slots to fill the dropdowns
					data.slots = slots;
					Days.findAll().then(days => {
						// find all days to fill the Days
						data.days = days;
						daySlots.findAll({ attributes: ['id', 'slotId', 'dayId'] }).then(eachDaySlots => {
							data.eachDaySlots = eachDaySlots;
							let nextWeek = getDates();
							data.dates = nextWeek;
							let allEmps = '';
							let allDates = '';
							data.employees.forEach(emp => {
								allEmps += `'${emp.id}',`;
							});
							allEmps = allEmps.slice(0, -1);
							nextWeek.forEach(date => {
								allDates += `'${date}',`;
							});
							allDates = allDates.slice(0, -1);
							data.dates = nextWeek;
							sequelize
								.query(`SELECT * FROM "availability" WHERE "employeeId" IN(${allEmps})`, {
									type: sequelize.QueryTypes.INSERT
								})
								.then(avails => {
									if (avails[0].length > 0) {
										data.avail = avails[0];
									}
									sequelize
										.query(`SELECT * FROM "schedules" WHERE "employeeId" IN(${allEmps}) AND "date" IN (${allDates})`, {
											type: sequelize.QueryTypes.INSERT
										})
										.then(sched => {
											if (sched[0].length > 0) {
												data.schedule = sched[0];
											}
											res.render('manager/schedule-grid', { data });
										});
								});
						});
					});
				})
				.catch(err => {
					next(err);
				});
		});
	} else {
		let errorMsg = { msg: 'You do not have permission for this route' };
		res.render('errorPage', { errorMsg });
	}
};

// ----- HELPER FUNCTION - GETS DATES FOR THE NEXT WEEK-------

let getDates = () => {
	let today = new Date();
	let day = today.getDay();
	let nearestSunday = new Date(new Date().getTime() + (7 - day - 1) * 24 * 60 * 60 * 1000);
	let nextWeek = [nearestSunday.toISOString().slice(0, 10)];
	for (let i = 1; i < 7; i++) {
		nextWeek.push(new Date(nearestSunday.getTime() + i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
	}
	return nextWeek;
};

// ---------- GETTING MANAGER'S SCHEDULE THROUGH A FORM-------------

module.exports.getManagerSchedule = (req, res, next) => {
	if (res.locals.manager == true) {
		const { Employee, Department, Slots, Days, daySlots, sequelize } = req.app.get('models');
		const managerDept = req.session.passport.user.departmentId;
		const managerId = req.session.passport.user.id;
		let data = {};
		Employee.findAll({ include: [{ model: Department }], where: { departmentId: managerDept } }).then(employees => {
			data.employees = employees;
			Slots.findAll().then(slots => {
				// find all slots to fill the dropdowns
				data.slots = slots;
				Days.findAll().then(days => {
					// find all days to fill the Days
					data.days = days;
					daySlots.findAll({ attributes: ['id', 'slotId', 'dayId'] }).then(eachDaySlots => {
						data.eachDaySlots = eachDaySlots;
						let nextWeek = getDates();
						let allDates = '';
						nextWeek.forEach(date => {
							allDates += `'${date}',`;
						});
						allDates = allDates.slice(0, -1);
						data.dates = nextWeek;
						sequelize
							.query(`SELECT * FROM "schedules" WHERE "employeeId" = ${managerId} AND "date" IN (${allDates})`, {
								type: sequelize.QueryTypes.INSERT
							})
							.then(avails => {
								if (avails[0].length > 0) {
									data.schedule = avails[0];
									data.display = true;
									// res.json(data);
									res.render('manager/manager-schedule', { data });
								} else {
									// res.json(data);
									data.display = false;
									res.render('manager/manager-schedule', { data });
								}
							})
							.catch(err => {
								next(err);
							});
					});
				});
			});
		});
	} else {
		let errorMsg = { msg: 'You do not have permission for this route' };
		res.render('errorPage', { errorMsg });
	}
};

//--------- SAVE MANAGER'S SCHEDULE ----------

module.exports.postManagerSchedule = (req, res, next) => {
	if (res.locals.manager) {
		const { sequelize } = req.app.get('models');
		let rightNow = new Date().toISOString();
		let output = req.body.slots;
		let currentEmployeeId = req.session.passport.user.id;
		let nextWeek = getDates();
		let sqlQuery = 'INSERT INTO "schedules" ("employeeId", "daySlotId", "date", "createdAt", "updatedAt") values';
		output.forEach(op => {
			if (op !== '0') {
				op = op.split(':');
				sqlQuery += `(${currentEmployeeId}, ${op[0]}, '${
					nextWeek[parseInt(op[1]) - 1]
				}', '${rightNow}', '${rightNow}'),`;
			}
		});
		sqlQuery = sqlQuery.slice(0, -1);
		sequelize
			.query(sqlQuery, { type: sequelize.QueryTypes.INSERT })
			.then(() => {
				res.redirect('/manager/generate-schedule');
			})
			.catch(err => next(err));
	} else {
		let errorMsg = { msg: 'You do not have permission for this route' };
		res.render('errorPage', { errorMsg });
	}
};

// --------- DISPLAY GENERATED SCHEDULE -------------

module.exports.generateSchedule = (req, res, next) => {
	if (res.locals.manager == true) {
		const { Employee, Slots, Days, daySlots, sequelize } = req.app.get('models');
		const managerDept = req.session.passport.user.departmentId;
		let data = {};
		Employee.findAll({ where: { departmentId: managerDept } }).then(employees => {
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
							let allDates = '';
							let allEmps = '';
							nextWeek.forEach(date => {
								allDates += `'${date}',`;
							});
							data.employees.forEach(emp => {
								allEmps += `'${emp.id}',`;
							});
							allEmps = allEmps.slice(0, -1);
							allDates = allDates.slice(0, -1);
							data.dates = nextWeek;
							sequelize
								.query(`SELECT * FROM "availability" WHERE "employeeId" IN(${allEmps})`, {
									type: sequelize.QueryTypes.INSERT
								})
								.then(avails => {
									if (avails[0].length > 0) {
										data.avail = avails[0];
										// res.render('manager/manager-schedule', { data });
									}
									sequelize
										.query(`SELECT * FROM "schedules" WHERE "employeeId" IN(${allEmps}) AND "date" IN (${allDates})`, {
											type: sequelize.QueryTypes.INSERT
										})
										.then(sched => {
											if (sched[0].length > 0) {
												data.schedule = sched[0];
											}
											// res.json(data);
											res.render('manager/schedule', { data });
										});
								});
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

//---------- SAVING THE EMPLOYEE'S SCHEDULE DATA TO THE TABLE-------

module.exports.makeSchedule = (req, res, next) => {
	if (res.locals.manager) {
		const { sequelize } = req.app.get('models');
		// res.json(req.body);
		let getDateFromDay = day => {
			let nextWeek = getDates();
			return nextWeek[day - 1];
		};
		let data = req.body.slots;
		data.forEach(piece => {
			if (piece !== '0') {
				piece = piece.split(':');
				let employeeId = piece[0];
				let daySlotId = piece[1];
				let date = getDateFromDay(piece[2]);
				let today = new Date().toISOString();
				sequelize
					.query(
						`INSERT INTO "schedules"("employeeId", "daySlotId", "date", "createdAt", "updatedAt") VALUES('${employeeId}', '${daySlotId}', '${date}', '${today}', '${today}')`,
						{
							type: sequelize.QueryTypes.INSERT
						}
					)
					.then(() => {
						res.redirect('/manager/view-schedule');
					})
					.catch(err => next(err));
			}
		});
	} else {
		let errorMsg = { msg: 'You do not have permission for this route' };
		res.render('errorPage', { errorMsg });
	}
};

// ----- DISPLAY THE SCHEDULE ONCE DONE--------

module.exports.displaySchedule = (req, res, next) => {
	if (res.locals.manager) {
		const { Employee, Slots, Days, daySlots, sequelize } = req.app.get('models');
		const managerDept = req.session.passport.user.departmentId;
		let data = {};
		Employee.findAll({ where: { departmentId: managerDept } }).then(employees => {
			data.employees = employees;
			Slots.findAll().then(slots => {
				// find all slots to fill the dropdowns
				data.slots = slots;
				Days.findAll()
					.then(days => {
						// find all days to fill the Days
						data.days = days;
						daySlots.findAll({ attributes: ['id', 'slotId', 'dayId'] }).then(eachDaySlots => {
							data.eachDaySlots = eachDaySlots;
							let nextWeek = getDates();
							let allDates = '';
							let allEmps = '';
							nextWeek.forEach(date => {
								allDates += `'${date}',`;
							});
							data.employees.forEach(emp => {
								allEmps += `'${emp.id}',`;
							});
							allEmps = allEmps.slice(0, -1);
							allDates = allDates.slice(0, -1);
							data.dates = nextWeek;
							sequelize
								.query(`SELECT * FROM "schedules" WHERE "employeeId" IN(${allEmps}) AND "date" IN (${allDates})`, {
									type: sequelize.QueryTypes.INSERT
								})
								.then(sched => {
									if (sched[0].length > 0) {
										data.schedule = sched[0];
									}
									// res.json(data);
									res.render('manager/schedule-view', { data });
								});
						});
					})
					.catch(err => {
						next(err);
					});
			});
		});
	} else {
		let errorMsg = { msg: 'You do not have permission for this route' };
		res.render('errorPage', { errorMsg });
	}
};

//------- SAVING THE EDITED SCHEDULE -------------

module.exports.editSchedule = (req, res, next) => {
	if (res.locals.manager) {
		const { sequelize } = req.app.get('models');
		// res.json(req.body);
		req.body.slots.forEach(slot => {
			if (slot !== '0') {
				slot = slot.split(':');
				let employeeId = slot[0];
				let daySlotId = slot[1];
				let dates = getDates();
				let x = parseInt(slot[2]);
				let i = x - 1;
				let date = dates[i];
				let today = new Date().toISOString();
				if (daySlotId == 0) {
					sequelize
						.query(`DELETE FROM "schedules" WHERE "employeeId"='${employeeId}' AND "date" = '${date}'`, {
							type: sequelize.QueryTypes.SELECT
						})
						.then(() => {});
				} else {
					sequelize
						.query(`SELECT * FROM "schedules" WHERE "employeeId"='${employeeId}' AND "date" = '${date}'`, {
							type: sequelize.QueryTypes.SELECT
						})
						.then(data => {
							if (data.length == 0) {
								sequelize.query(
									`INSERT INTO "schedules"("employeeId","date","daySlotId","createdAt","updatedAt") VALUES('${employeeId}','${date}', '${daySlotId}','${today}', '${today}')`,
									{
										type: sequelize.QueryTypes.SELECT
									}
								);
							} else {
								sequelize
									.query(`DELETE FROM "schedules" WHERE "employeeId"='${employeeId}' AND "date" = '${date}'`, {
										type: sequelize.QueryTypes.SELECT
									})
									.then(() => {
										sequelize.query(
											`INSERT INTO "schedules"("employeeId","date","daySlotId","createdAt","updatedAt") VALUES('${employeeId}','${date}', '${daySlotId}','${today}', '${today}')`,
											{
												type: sequelize.QueryTypes.SELECT
											}
										);
									})
									.catch(err => next(err));
							}
						});
				}
			}
		});
		res.redirect('/manager/view-schedule');
	} else {
		let errorMsg = { msg: 'You do not have permission for this route' };
		res.render('errorPage', { errorMsg });
	}
};
