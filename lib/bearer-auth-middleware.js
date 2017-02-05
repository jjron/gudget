'use strict';

const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const debug = require('debug')('gudget:bearer-auth-middleware');

const User = require('../model/user.js');

module.exports = function(req, res, next) {
  debug('bearer authorization middleware');
  let authorization = req.headers.authorization;
  if(!authorization)
    return next(createError(401, 'authorization not forwarded'));

  let token = authorization.split('Bearer ')[1];

  jwt.verify(token, process.env.APP_SECRET, function(err, decoded){
    if(err) return next(createError(401, err.message));

    User.findOne({findHash: decoded.findHash})
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => next(createError(401, err.message)));
  });
};
