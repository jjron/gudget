'use strict';

const firebase = require('firebase');
const createError = require('http-errors');
const debug = require('debug')('gudget:bearer-auth-middleware');

module.exports = (req, res, next) => {
  debug('bearer auth middleware');
  if(!req.headers.authorization)
    return next(createError(401, 'no Authorization header forwarded'));

  let token = req.headers.authorization.split('Bearer ')[1];
  if(!token) return next(createError(401, 'no token'));
  
  firebase.auth().signInWithCustomToken(token)
  .then(() => next())
  .catch(err => next(createError(401, err.message)));
};
