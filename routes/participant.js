const {
  getProtectedRouter, getRouter, getValidator, gFunction, getSmsToken,
} = require('../helpers/api')();

const { body, query } = getValidator();
const protectedRouter = getProtectedRouter();
const router = getRouter();

const { event, participant } = require('../models');
const _ = require('lodash');

const Event = event;
const Participant = participant;

const isGuest = async function (req, res, next) {
  const uId = res.locals.decoded.uuid || null;
  const id_event = Number(req.query.event || req.body.event || null);

  const publicEvent = await Event.findOne({
    where: {
      id: id_event,
      type: 'public',
    },
  });

  if (publicEvent) {
    return next();
  }

  const participant = await Participant.findOne({
    where: {
      id: id_event,
      user_id: uId,
    },
  });

  if (participant) {
    res.locals.event = event;
    next();
  } else {
    res.status(400).json({ message: 'is not organizer' });
  }
};

const isOrganizer = async function (req, res, next) {
  const uId = res.locals.decoded.uuid || null;
  const id_event = Number(req.query.event || req.body.event || null);

  const participant = await Participant.findOne({
    where: {
      id: id_event,
      user_id: uId,
      type: 'organizer',
    },
  });

  if (participant) {
    res.locals.event = event;
    next();
  } else {
    res.status(400).json({ message: 'is not organizer' });
  }
};

protectedRouter.get('/', isGuest, async (req, res, next) => {
  const id_event = Number(req.query.event || null);

  const participants = await Participant.findAll({
    where: {
      id: id_event,
    },
  });

  if (participants) {
    res.status(400).json(participants);
  }
});

protectedRouter.post('/add', isOrganizer, async (req, res, next) => {
  const id_event = Number(req.query.event || null);
  const { participants } = req.body;

  console.log(protectedRouter.tokenSms);
  // const participants = await Participant.findAll({
  //   where: {
  //     id: id_event,
  //   },
  // });
  next();
  if (participants) {
    res.status(400).json(participants);
  }
});

module.exports = router;
