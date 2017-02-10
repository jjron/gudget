'use strict';

const Router = require('express').Router;
const createError = require('http-errors');
const jsonParser = require('body-parser').json();
const User = require('../models/user.js');
const debug = require('debug')('gudget:user-router');
const basicAuthMiddleware = require('../lib/basic-auth-middleware.js');
const bearerAuthMiddleware = require('../lib/bearer-auth-middleware.js');

const userRouter = module.exports = new Router();

userRouter.post('/api/signup', jsonParser, function(req, res, next){
  debug('POST /api/signup');

  let password = req.body.password;
  delete req.body.password;
  new User(req.body)
  .generatePasswordHash(password)
  .then(user => {
    return user.generateToken();
  })
  .then(token => {
    res.send(token);
  })
  .catch(next);
});

userRouter.get('/api/login', basicAuthMiddleware, function(req, res, next){
  debug('GET /api/login');

  req.user.generateToken()
  .then(token => res.send(token))
  .catch(next);
});

userRouter.delete('/api/leave', bearerAuthMiddleware, function(req, res, next) {
  debug('DELETE /api/leave');
  User.findByIdAndRemove(req.user._id.toString())
  .then(() => res.sendStatus(204))
  .catch(err => {
    return next(createError(404, err.message));
  });
});
