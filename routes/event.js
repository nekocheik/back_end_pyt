const {
  getProtectedRouter, getRouter, getValidator, gFunction,
} = require('../helpers/api')();

const { body } = getValidator();
const protectedRouter = getProtectedRouter();
const router = getRouter();

const { event } = require('../models');
const _ = require('lodash');

const Event = event;

protectedRouter.get('/', [
  body('n').exists()
    .custom((value) => _.isNumber(Number(value)) && Number(value) < 100),
  body('o')
    .custom((value) => _.isNumber(!value || (Number(value)) && Number(value) < 100)),
], (req, res, next) => {
  const uId = res.locals.decoded.uuid;
  const limit = Number(req.query.n) || 50;
  const offset = Number(req.query.o) || 0;
  Event.findAndCountAll({
    where: {
      user_id: uId,
    },
    offset,
    limit,
  })
    .then((data) => {
      res.status(200).json(data);
    }).catch((error) => res.status(400).json({ error }));
});

protectedRouter.post('/', [
  body('name').exists().isString()
    .isLength({ min: 3, max: 40 }),
  body('description').exists().isString()
    .isLength({ min: 0, max: 255 }),
], (req, res, next) => {
  const uId = res.locals.decoded.uuid;
  console.log(req.body);
  const { description, name } = req.body;
  Event.create({
    name,
    description,
    user_id: uId,
  })
    .then((event) => {
      res.status(200).json({
        ...event.dataValues,
      });
    }).catch((error) => res.status(400).json({ error }));
});

module.exports = router;
