'use strict';

const indexName ='events_type_index';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addIndex('events', {
      name:  indexName,
      fields: ['type'],
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeIndex('events', indexName);
  }
};
