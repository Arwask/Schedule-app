'use strict';
module.exports = (sequelize, DataTypes) => {
  var Employee = sequelize.define('Employee', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    email: DataTypes.STRING,
    employeeId: DataTypes.INTEGER,
    password: DataTypes.STRING,
    departmentId: DataTypes.INTEGER,
    jobTitle: DataTypes.STRING,
    dob: DataTypes.DATEONLY,
    startDate: DataTypes.DATEONLY,
    endDate: DataTypes.DATEONLY,
    totalHours: DataTypes.INTEGER,
    notes: DataTypes.STRING,
    ecFirstName: DataTypes.STRING,
    ecLastName: DataTypes.STRING,
    ecPhoneNumber: DataTypes.STRING
  });

  Employee.associate = function(models) {
    Employee.belongsTo(models.Department, {
      foreignKey: 'departmentId'
    });

    Employee.belongsToMany(models.daySlots, {
      foreignKey: 'employeeId',
      through: 'schedules',
      as: 'employeeScheduleId'
    });

    Employee.belongsToMany(models.daySlots, {
      foreignKey: 'employeeId',
      through: 'availability',
      as: 'employeeAvailId'
    });
  };
  return Employee;
};
