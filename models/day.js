'use strict';
module.exports = (sequelize, DataTypes) => {
  var Day = sequelize.define('Day', {
    name: DataTypes.STRING
  });
  Day.associate = function(models) {
    Day.belongsToMany(Slots, {
      foreignKey: slotId,
      though: 'daySlots'
    });
  };
  return Day;
};
