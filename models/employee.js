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
    ecFirstName: DataTypes.STRING,
    ecLastName: DataTypes.STRING,
    ecPhoneNumber: DataTypes.STRING
  });

  Employee.associate = function(models) {
    Employee.belongsTo(Department, {
      foreignKey: departmentId
    });

    Employee.belongsToMany(schedules, {
      foreignKey: 'employeeId',
      through: 'schedules'
    });

    Employee.belongsToMany(availability, {
      foreignKey: 'employeeId',
      through: 'availability'
    });
  };
  return Employee;
};
