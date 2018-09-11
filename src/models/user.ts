'use strict';

export default (sequelize, DataTypes) => {
  const user = sequelize.define('users', {
    github: DataTypes.JSON,
    githubId: DataTypes.INTEGER,
  }, {});
  user.associate = function(models) {
    // associations can be defined here
  };
  return user;
};
