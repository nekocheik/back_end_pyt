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
      models.participant.hasOne(models.event, {
        foreignKey: 'event_id',
      });
    }
  }
  participant.init({
    event_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'participant',
  });
  return participant;
};
