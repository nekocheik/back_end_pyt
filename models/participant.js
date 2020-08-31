const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class participant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  participant.init({
    user_id: DataTypes.STRING,
    event_id: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'participant',
  });
  return participant;
};
