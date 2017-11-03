'use strict';

let daySlot = require('../data/daySlots');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('daySlots', daySlot, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('daySlots', null, {});
  }
};
