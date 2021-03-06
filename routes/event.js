const {
  getProtectedRouter, getRouter, getValidator, gFunction,
} = require('../helpers/api')();

const { body, query } = getValidator();
const protectedRouter = getProtectedRouter();
const router = getRouter();

const { event, participant, date } = require('../models');
const _ = require('lodash');

const Participant = participant;
const Event = event;

protectedRouter.get('/events', [
  body('n').exists()
    .custom((value) => _.isNumber(Number(value)) && Number(value) < 100),
  body('o')
    .custom((value) => _.isNumber(!value || (Number(value)) && Number(value) < 100)),
], (req, res) => {
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

protectedRouter.get('/', [
  body('id').exists()
    .custom((value) => _.isNumber(Number(value)) && Number(value) < 100),
], (req, res, next) => {
  const uId = res.locals.decoded.uuid;
  const id = Number(req.query.id);
  Event.findOne({
    where: {
      user_id: uId,
      id,
    },
  })
    .then((event) => {
      Participant.findAll({
        where: {
          event_id: event.id,
        },
      }).then((participant) => {
        date.findAll({
          event_id: event.id,
        }).then((dates) => {
          res.status(200).json({
            ...event.dataValues,
            participant,
            dates,
          });
        });
      });
    }).catch((error) => res.status(400).json({ error }));
});

protectedRouter.post('/', [
  body('name').exists().isString()
    .isLength({ min: 3, max: 40 }),
  body('description').exists().isString()
    .isLength({ min: 0, max: 255 }),
], (req, res, next) => {
  const uId = res.locals.decoded.uuid;
  const { description, name, dates } = req.body;
  Event.create({
    name,
    description,
    user_id: uId,
  })
    .then((event) => {
      Participant.create(gFunction().cleanVariables({
        event_id: event.id, user_id: uId, type: 'organizer',
      })).then((participants) => {
        res.status(200).json({
          ...event.dataValues,
        });
        dates.forEach((currentDate) => {
          date.create({
            event_id: event.dataValues.id,
            date: new Date(currentDate),
          });
        });
      });
    }).catch((error) => res.status(400).json({ error }));
});

protectedRouter.put('/', [
  body('name').isString()
    .isLength({ min: 3, max: 40 }),
  body('description').isString()
    .isLength({ min: 0, max: 255 }),
  body('description').exists(),
], (req, res) => {
  const uId = res.locals.decoded.uuid;
  const { description, name, id } = req.body;
  Event.update(gFunction().cleanVariables({ description, name }), {
    where: {
      user_id: uId,
      id: Number(id),
    },
  })
    .then((data) => {
      if (data[0]) {
        res.status(200).json({
          message: 'the event is update',
          data,
        });
      } else {
        res.status(400).json({
          message: 'the event is dont found',
        });
      }
    }).catch((error) => res.status(400).json({ error }));
});

protectedRouter.delete('/', [
  body('id').exists(),
  query('id').exists(),
], (req, res) => {
  const uId = res.locals.decoded.uuid;
  const id = req.body.id || req.query.id || null;
  if (!id) {
    return res.status(400).json({ errors: errors.array() });
  }
  Event.destroy({
    where: {
      user_id: uId,
      id: Number(id),
    },
  })
    .then((data) => {
      if (data) {
        res.status(200).json({
          message: 'the event is deleted',
        });
      } else {
        res.status(400).json({
          message: 'the event is not found',
        });
      }
    }).catch((error) => res.status(400).json({ error }));
});

module.exports = router;
