'use strict';
module.exports = (sequelize, DataTypes) => {
  var Days = sequelize.define('Days', {
    name: DataTypes.STRING,
    startTime: DataTypes.STRING,
    endTime: DataTypes.STRING
  });
  Days.associate = models => {
    Days.belongsToMany(models.Slots, {
      foreignKey: 'dayId',
      through: 'daySlots'
    });
  };
  return Days;
};
