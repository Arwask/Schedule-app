'use strict';

let avail = require('../data/availability');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('availability', avail, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('availability', null, {});
  }
};
