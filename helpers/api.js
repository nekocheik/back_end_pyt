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
  module.participant = () => participant;
  module.event = () => event;

  return module;
};
