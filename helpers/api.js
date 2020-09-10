module.exports = function () {
  const { withJWTAuthMiddleware } = require('express-kun');
  const express = require('express');
  const { body, query, validationResult } = require('express-validator');
  const gFunction = require('./globalFunction.js')();

  const router = express.Router();
  const protectedRouter = withJWTAuthMiddleware(router, 'fsafkddoffgdgned@gmaifddsal');

  module.getProtectedRouter = () => protectedRouter;
  module.getRouter = () => router;
  module.getValidator = () => ({ body, query, validationResult });
  module.gFunction = () => gFunction();

  return module;
};
