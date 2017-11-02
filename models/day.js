'use strict';
module.exports = (sequelize, DataTypes) => {
  var Day = sequelize.define('Day', {
    name: DataTypes.STRING
  });
  Day.associate = models => {
    Day.belongsToMany(models.Slots, {
      foreignKey: 'slotId',
      through: 'daySlots'
    });
  };
  return Day;
};
