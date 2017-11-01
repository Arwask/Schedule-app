'use strict';
module.exports = (sequelize, DataTypes) => {
  var Department = sequelize.define('Department', {
    name: DataTypes.STRING,
    storeId: DataTypes.INTEGER,
    openTime: DataTypes.STRING,
    closeTime: DataTypes.STRING
  });
  Department.associate = function(models) {
    Department.hasMany(Employee, {
      foreignKey: departmentId
    });
  };
  return Department;
};
