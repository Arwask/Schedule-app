'use strict';
module.exports = (sequelize, DataTypes) => {
  var daySlots = sequelize.define('daySlots', {
    slotId: DataTypes.INTEGER,
    dayId: DataTypes.INTEGER
  });

  daySlots.associate = function(models) {
    daySlots.belongsToMany(models.Employee, {
      foreignKey: 'employeeId',
      through: 'schedules',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      as: 'employeeScheduleId'
    });
    daySlots.belongsToMany(models.Employee, {
      foreignKey: 'employeeId',
      through: 'availability',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      as: 'employeeAvailId'
    });
  };
  return daySlots;
};
