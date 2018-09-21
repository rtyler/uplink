'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('grants', [
        {
          name: 'rtyler',
          type: 'jest-example',
        },
    ]);
  },

  down: (queryInterface, Sequelize) => {
  }
};
