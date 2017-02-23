'use strict';

const {Router} = require('express');
const debug = require('debug')('fireslog:auth-router');

const basicAuth = require('../lib/basic-auth-middleware.js');

const authRouter = module.exports = new Router();

authRouter.get('/api/login', basicAuth, (req, res, next) => {
  debug('GET /api/login');
  res.send(req.token);
});
