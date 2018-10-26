'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('CREATE MATERIALIZED VIEW first_type AS SELECT DISTINCT(type), MIN("createdAt") FROM events GROUP BY type');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('DROP MATERIALIZED VIEW first_type');
  }
};
