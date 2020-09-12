const {
  getProtectedRouter, getRouter, getValidator, gFunction,
} = require('../helpers/api')();

const { body, query } = getValidator();
const protectedRouter = getProtectedRouter();
const router = getRouter();

const { event, participant } = require('../models');
const _ = require('lodash');

const Event = event;
const Participant = participant;

const isOrganizer = async function (req, res, next) {
  const uId = res.locals.decoded.uuid || null;
  const id_event = req.query.id || null;

  const participant = await Participant.findOne({
    where: {
      id: id_event,
      user_id: uId,
      type: 'organizer',
    },
  });

  console.log(participant);
  if (participant) {
    res.locals.event = event;
    next();
  } else {
    res.status(400).json({ message: 'is not organizer' });
  }
};

protectedRouter.get('/', isOrganizer, (req, res, next) => {
  res.status(400).json({ message: 'your organizer' });
});

module.exports = router;
