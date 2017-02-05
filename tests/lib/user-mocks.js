'use strict';

const debug = require('debug')('gudget:user-mocks');
const User = require('../../model/user.js');

module.exports = function(done) {
  debug('mock user');
  new User({
    username: 'user' + Math.random(),
    email: 'name@email.com' + Math.random(),
  })
  .generatePasswordHash('1234')
  .then(user => user.save())
  .then(user => {
    this.tempUser = user;
    return user.generateToken();
  })
  .then(token => {
    this.tempToken = token;
    done();
  })
  .catch(done);
};
