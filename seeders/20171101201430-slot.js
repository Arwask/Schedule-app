'use strict';

let slot = require('../data/slot');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Slots', slot, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Slots', null, {});
  }
};
