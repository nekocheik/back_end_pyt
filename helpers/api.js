module.exports = function () {
  const { withJWTAuthMiddleware } = require('express-kun');
  const express = require('express');
  const { body, query, validationResult } = require('express-validator');
  const gFunction = require('./globalFunction.js')();
  const axios = require('axios');
  const qs = require('qs');
  let token = null;
  const env = require('dotenv').config().parsed;

  (async () => {
    axios({
      url: 'https://api.orange.com/oauth/v2/token',
      method: 'post',
      data: qs.stringify({
        grant_type: 'client_credentials',
      }),
      headers: {
        Authorization: `Basic ${env.AUTH_ORANGE}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).then((data) => {
      token = data.access_token;
      console.log(data);
    })
      .catch((error) => {
        console.log('token orange dont get');
      });
  })();

  const router = express.Router();
  const protectedRouter = withJWTAuthMiddleware(router, 'fsafkddoffgdgned@gmaifddsal');

  module.getToken = () => token;
  module.getProtectedRouter = () => protectedRouter;
  module.getRouter = () => router;
  module.getValidator = () => ({ body, query, validationResult });
  module.gFunction = () => gFunction;

  return module;
};
