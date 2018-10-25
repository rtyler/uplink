'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('events', 'payload', {
        allowNull: false,
        type: Sequelize.JSONB
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
     * Not bothering with a down migration since this will modify data
     */
  }
};
