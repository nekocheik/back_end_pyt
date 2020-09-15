const {
  getProtectedRouter, getRouter, Event, User,
  Participant, getValidator, gFunction,
  getUser, isGuest, isOrganizer,
} = require('../helpers/api')();
const async = require('async');

const { body, query, validationResult } = getValidator();
const protectedRouter = getProtectedRouter();
const router = getRouter();

const _ = require('lodash');

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

protectedRouter.post('/', isOrganizer, [
  body('participant').exists().isEmail(),
], async (req, res, next) => {
  const event_id = Number(req.query.event || null);
  const { participant } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

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

protectedRouter.delete('/', isOrganizer, async (req, res, next) => {
  const event_id = Number(req.query.event || null);
  const { participant } = req.body;

  async.waterfall([
    async function () {
      const gest = await User.findOne({
        where: {
          email: participant,
        },
      });
      return gest;
    },

    async function (gest) {
      if (gest) {
        const participantAlreadyRegistred = await Participant.destroy({
          where: {
            user_id: gest.uuid,
            event_id,
          },
        });

        return res.status(400).json({ message: 'user delete white succés', participantAlreadyRegistred });
      }
      return res.status(400).json({ message: 'user dont exist' });
    },

  ]);
});

module.exports = router;
