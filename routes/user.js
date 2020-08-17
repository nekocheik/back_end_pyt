const express = require('express');

const router = express.Router();

const models = require('../models');

const { User } = models;

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

router.post('/', (req, res, next) => {
  let userName = req.query.name;
  if (userName) {
    userName = userName.toLocaleLowerCase();
    User.create({
      name: userName,
    }).then((user) => {
      res.status(200).json({
        message: `new user ${userName} is add`,
        user,
      });
    }).catch((error) => {
      res.status(400).json({
        message: error,
      });
    });
  } else {
    res.status(400).json({
      message: 'the value is incorrect',
    });
  }
});

module.exports = router;
