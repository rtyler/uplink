'use strict';

export default (sequelize, DataTypes) => {
  const grant = sequelize.define('grants', {
    name: DataTypes.STRING,
    type: DataTypes.STRING
  }, {});
  grant.associate = function(models) {
    // associations can be defined here
  };
  return grant;
};
