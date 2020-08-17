'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
    }
  };
  User.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });

  User.associate = function(models) {
    User.hasMany(models.Event, {foreignKey: { name: 'id', allowNull: true }})
  };

  return User;
};