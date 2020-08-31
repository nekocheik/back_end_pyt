'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class vote extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  vote.init({
    date_id: DataTypes.STRING,
    participant_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'vote',
  });
  return vote;
};