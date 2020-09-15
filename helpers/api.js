module.exports = function () {
  const { withJWTAuthMiddleware } = require('express-kun');
  const express = require('express');
  const { body, query, validationResult } = require('express-validator');
  const gFunction = require('./globalFunction.js')();
  const axios = require('axios');
  const qs = require('qs');
  const token = null;
  const env = require('dotenv').config().parsed;
  const models = require('../models');

  const { User, event, participant } = models;
  const Event = event;
  const Participant = participant;

  const router = express.Router();
  const protectedRouter = withJWTAuthMiddleware(router, 'fsafkddoffgdgned@gmaifddsal');

  module.getToken = () => token;
  module.getProtectedRouter = () => protectedRouter;
  module.getRouter = () => router;
  module.getValidator = () => ({ body, query, validationResult });
  module.gFunction = () => gFunction;
  module.Participant = () => participant;
  module.Event = () => event;

  module.isGuest = async function (req, res, next) {
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

  module.isOrganizer = async function (req, res, next) {
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

  return module;
};
