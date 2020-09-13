const {
  Model,
} = require('sequelize');
const bcrypt = require('bcrypt');

const salt = 10;

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
    }
  }

  const isUnique = function (value, name) {
    return new Promise((res, reject) => {
      User.findOne({
        where: {
          [name]: value,
        },
      }).then((val) => {
        if (val) {
          reject(new Error(`${name} address already in use!`));
        } else {
          res();
        }
      });
    });
  };

  User.init({
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: sequelize.UUIDV4,
    },
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isUnique(val, other) {
          console.log(other(), 'ici');
          return isUnique(val, 'phone_number');
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isUnique(val) {
          return isUnique(val, 'email');
        },
        isEmail: true,
      },
    },
  }, {
    hooks: {
      beforeBulkCreate: ((user, options) => bcrypt.hash(user.password, salt)
        .then((hash) => {
          user.password = hash;
        })
        .catch((err) => {
          throw new Error(err);
        })),
      beforeUpdate: ((user, options) => bcrypt.hash(user.password, salt)
        .then((hash) => {
          user.password = hash;
        })
        .catch((err) => {
          throw new Error(err);
        })),
    },
    sequelize,
    modelName: 'User',
  });

  User.removeAttribute('id');
  User.compare = function (value, encrypted) {
    return bcrypt.compareSync(value, encrypted);
  };

  return User;
};
