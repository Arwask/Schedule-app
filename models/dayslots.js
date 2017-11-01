'use strict';
module.exports = (sequelize, DataTypes) => {
  var daySlots = sequelize.define('daySlots', {
    slotId: DataTypes.INTEGER,
    dayId: DataTypes.INTEGER
  });

  daySlots.associate = function(models) {
    daySlots.belongsToMany(Employee, {
      foreignKey: daySlotId,
      through: 'schedules'
    });
    daySlots.belongsToMany(Employee, {
      foreignKey: daySlotId,
      through: 'availability'
    });
  };
  return daySlots;
};
