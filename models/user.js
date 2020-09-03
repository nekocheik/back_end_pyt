const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: sequelize.UUIDV4,
    },
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isUnique: (email) => new Promise((res, reject) => {
          User.findOne({
            where: {
              email,
            },
          }).then((val) => {
            if (val) {
              reject(new Error('Email address already in use!'));
            } else {
              res();
            }
          });
        }),
        isEmail: true,
      },
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  User.removeAttribute('id');
  return User;
};
