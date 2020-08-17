const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Date extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Date.init({
    date: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Date',
  });

  Date.associate = function (model) {
    Date.hasMany(model.Event, { as: 'Events' });
  };
  return Date;
};
