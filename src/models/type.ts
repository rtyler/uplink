'use strict';

export default (sequelize, DataTypes) => {
  const Type = sequelize.define('types', {
    type: DataTypes.STRING,
  }, {});
  Type.associate = function(models) {
  };
  return Type;
};
