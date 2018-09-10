'use strict';

export default (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    type: DataTypes.STRING,
    payload: DataTypes.JSON
  }, {});
  Event.associate = function(models) {
  };
  return Event;
};
