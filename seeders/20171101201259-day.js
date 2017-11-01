'use strict';

let day = require('../data/day');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Days', day, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Days', null, {});
  }
};
