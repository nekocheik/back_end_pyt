const express = require('express');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('sqlite::memory:');

const router = express.Router();
const models = require('../models');

const { User } = models;
const { body, validationResult } = require('express-validator');

/* GET home page. */
router.get('/', (req, res, next) => {
  const { id } = req.query;
  if (id) {
    User.findOne({
      where: {
        id,
      },
    }).then((user) => {
      res.status(200).json({
        message: 'user find',
        user: {
          id: user.id,
          name: user.name,
        },
      });
    });
  }
});

router.post('/', [
  // email
  body('email').exists().isEmail(),
  // username
  body('username').exists().isString()
    .isLength({ min: 3, max: 15 }),
  // password
  body('password').exists().isString()
    .isLength({ min: 3, max: 15 }),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let { username, email, password } = req.body;
  username = username.toLocaleLowerCase();
  email = email.toLocaleLowerCase();

  User.create({
    username,
    email,
    password,
  }).then(() => {
    res.status(200).json({
      message: `new user ${username} is add`,
    });
  }).catch((messageError) => {
    const { message, type, path } = messageError.errors[0];
    res.status(400).json({ message, type, path });
  });
});

module.exports = router;
