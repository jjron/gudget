'use strict';

const createError = require('http-errors');
const debug = require('debug')('gudget:basic-auth-middleware');

const User = require('../models/user.js');

module.exports = function(req, res, next) {
  debug('basic authorization middleware');
  let authorization = req.headers.authorization;
  if(!authorization)
    return next(createError(401, 'authorization header not forwarded'));
  if(!authorization.startsWith('Basic '))
    return next(createError(401, 'Basic authorization not forwarded'));
  let basic64 = authorization.split('Basic ')[1];
  let usernameAndPassword = new Buffer(basic64, 'base64').toString().split(':');
  let username = usernameAndPassword[0];
  let password = usernameAndPassword[1];
  User.findOne({username: username})
  .then(user => {
    return user.comparePasswordHash(password);
  })
  .then(user => {
    req.user = user;
    next();
  })
  .catch(err => {
    next(createError(401, err.message));
  });
};
