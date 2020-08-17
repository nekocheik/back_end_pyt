const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Event.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    localisation: DataTypes.FLOAT,
  }, {
    sequelize,
    modelName: 'Event',
  });

  Event.associate = function (models) {
    Event.hasMany(models.User, { foreignKey: { name: 'id', allowNull: true } });
    Event.hasMany(models.Date, { as: 'Dates' });
  };
  return Event;
};
