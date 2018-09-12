'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('grants', [
        {
          name: 'rtyler',
          type: '*',
        },
        {
          name: 'daniel-beck',
          type: '*',
        },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('grants', null, {});
  }
};
