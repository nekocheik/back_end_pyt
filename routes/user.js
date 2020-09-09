const uuid = require('uuid');
const express = require('express');

const router = express.Router();
const { body, query, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { withJWTAuthMiddleware } = require('express-kun');
const models = require('../models');

const secretKey = 'fsafkddoffgdgned@gmaifddsal';
const protectedRouter = withJWTAuthMiddleware(router, secretKey);
const { User, event } = models;
const Event = event;

/* GET home page. */
// router.get('/', (req, res) => {
//   const { id } = req.query;
//   if (id) {
//     User.findOne({
//       where: {
//         id,
//       },
//     }).then((user) => {
//       res.status(200).json({
//         message: 'user find',
//         user: {
//           id: user.id,
//           name: user.username,
//         },
//       });
//     }).catch((error) => res.status(400).json({ error }));
//   }
// });

router.get('/', [[
  query('email').exists().isEmail(),
  query('password').exists().isString()
    .isLength({ min: 3, max: 55 }),
]], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.query;

  User.findOne({
    where: {
      email,
    },
  }).then((user) => {
    if (!User.compare(password, user.password)) {
      return res.status(400).json({ errors: 'error of value send' });
    }
    const token = jwt.sign({ uuid: user.uuid, email: user.email }, secretKey, {
      expiresIn: '2160h',
    });
    res.status(200).json({
      token,
    });
  }).catch((messageError) => {
    const { message, type, path } = messageError.errors[0];
    res.status(400).json({ errors: [{ message, type, path }] });
  });
});

/* GET home page. */
protectedRouter.get('/event', (req, res, next) => {
  const uId = res.locals.decoded.uuid;
  Event.create({
    name: 'dfsfdsds',
    password: 'DataTypes.STRING',
    user_id: uId,
  })
    .then((event) => {
      res.status(200).json({
        event,
      });
    }).catch((error) => res.status(400).json({ error }));
});

router.post('/', [
  body('email').exists().isEmail(),
  body('username').exists().isString()
    .isLength({ min: 3, max: 15 }),
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
      message: 'create user successfully',
    });
  }).catch((messageError) => {
    const { message, type, path } = messageError.errors[0];
    res.status(400).json({ errors: [{ message, type, path }] });
  });
});

module.exports = router;
