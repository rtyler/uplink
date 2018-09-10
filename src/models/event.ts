'use strict';

export default (sequelize, DataTypes) => {
  const Event = sequelize.define('events', {
    type: DataTypes.STRING,
    correlator: DataTypes.STRING,
    payload: DataTypes.JSON
  }, {});
  Event.associate = function(models) {
  };
  return Event;
};
