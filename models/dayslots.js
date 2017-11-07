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
      onUpdate: 'CASCADE'
    });
    daySlots.belongsToMany(models.Employee, {
      foreignKey: 'employeeId',
      through: 'availability',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };
  return daySlots;
};
