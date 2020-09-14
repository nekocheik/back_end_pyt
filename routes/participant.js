const {
  getProtectedRouter, getRouter, getValidator, gFunction, getSmsToken,
} = require('../helpers/api')();
const async = require('async');

const accountSid = 'AC4635aef870d9a5b4af79da6ab3ae5b71';
const authToken = '66db66b723f5a1c5609f69679f2559d8';
const client = require('twilio')(accountSid, authToken);
/// ////
const { body, query } = getValidator();
const protectedRouter = getProtectedRouter();
const router = getRouter();

const _ = require('lodash');
const { event, participant, User } = require('../models');

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
  const event_id = Number(req.query.event || null);

  const participants = await Participant.findAll({
    where: {
      event_id,
    },
  });

  if (participants) {
    res.status(400).json(participants);
  }
});

protectedRouter.post('/add', isOrganizer, async (req, res, next) => {
  const event_id = Number(req.query.event || null);
  const { participant } = req.body;

  async.waterfall([

    async function (callback) {
      const gest = await User.findOne({
        where: {
          email: participant,
        },
      });
      return gest;
    },

    async function (gest) {
      if (gest) {
        const participantAlreadyRegistred = await Participant.findOne({
          where: {
            user_id: gest.uuid,
            event_id,
          },
        });
        return { gest, participantAlreadyRegistred };
      }
      return res.status(400).json({ message: 'user dont exist' });
    },

    async function ({ gest, participantAlreadyRegistred }) {
      if (participantAlreadyRegistred) {
        return res.status(400).json({ message: 'user is alreadey in the party' });
      }
      const newParticipant = await Participant.create({
        user_id: gest.uuid,
        event_id,
      });

      if (newParticipant) {
        return res.status(200).json({ message: 'your are add a new gest', gest: newParticipant });
      }
      return res.status(400).json({ message: 'user is alreadey in the party' });
    },

  ]);

  // client.messages.create({
  //   body: 'Vous êtes invité à aller liker le github de nekocheik : https://github.com/nekocheik',
  //   from: '+17737869810',
  //   to: '+33 7 67 42 43 58',
  //   mediaUrl: 'https://climacons.herokuapp.com/clear.png',
  // }).then((message) => {
  //   console.log(message.sid);
  // }).catch((error) => {
  //   console.log(error);
  // });

  // const participants = await Participant.findAll({
  //   where: {
  //     id: id_event,
  //   },
  // });
  // next();
  // if (participants) {
  //   res.status(400).json(participants);
  // }
});

module.exports = router;
