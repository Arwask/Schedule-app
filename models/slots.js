'use strict';
module.exports = (sequelize, DataTypes) => {
  var Slots = sequelize.define('Slots', {
    startTime: DataTypes.STRING,
    endTime: DataTypes.STRING
  });

  Slots.associate = function(models) {
    Slots.belongsToMany(Day, {
      foreignKey: dayId,
      through: 'daySlots'
    });
  };
  return slots;
};
