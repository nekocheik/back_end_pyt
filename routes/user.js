const uuid = require('uuid');

const express = require('express');

const router = express.Router();
const { body, validationResult } = require('express-validator');
const models = require('../models');

const { User, event } = models;
const Event = event;

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
          name: user.username,
        },
      });
    }).catch((error) => res.status(400).json({ error }));
  }
});

/* GET home page. */
router.get('/event', (req, res, next) => {
  Event.create({
    name: 'dfsfdsds',
    password: 'DataTypes.STRING',
    user_id: 1,
  })
    .then((event) => {
      res.status(200).json({
        event,
      });
    }).catch((error) => res.status(400).json({ error }));
});

router.post('/', [
  // email
  body('email').exists().isEmail(),
  // username
  body('username').exists().isString()
    .isLength({ min: 3, max: 15 }),
  // password
  body('password').exists().isString()
    .isLength({ min: 3, max: 55 }),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let { username, email, password } = req.body;
  username = username.toLocaleLowerCase();
  email = email.toLocaleLowerCase();

  User.create({
    uuid: uuid.v4(),
    username,
    email,
    password,
  }).then(() => {
    res.status(200).json({
      message: `new user ${username} is add`,
    });
  }).catch((messageError) => {
    const { message, type, path } = messageError.errors[0];
    res.status(400).json({ errors: [{ message, type, path }] });
  });
});

module.exports = router;
