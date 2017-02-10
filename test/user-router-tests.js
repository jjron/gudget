'use strict';

require('./lib/mock-env.js');
const expect = require('chai').expect;
const superagent = require('superagent');
const User = require('../models/user.js');
const userMock = require('./lib/user-mocks.js');
const serverControl = require('./lib/server-control.js');
const baseURL = `http://localhost:${process.env.PORT}`;
// require('../server.js');

describe('testing user-router', function() {
  before(serverControl.startServer);
  after(serverControl.killServer);
  afterEach(done => {
    User.remove({})
    .then(() => done())
    .catch(done);
  });

  describe('testing POST /api/signup', function() {
    it('should respond with a user', done => {
      superagent.post(`${baseURL}/api/signup`)
      .send({
        username: 'chewie',
        email: 'grrrahh@holo.net',
        password: 'kylorensux',
      })
      .then(res => {
        expect(res.status).to.equal(200);
        expect(Boolean(res.text)).to.equal(true);
        done();
      })
      .catch(done);
    });

    it('a missing field should respond with 400 status', done => {
      superagent.post(`${baseURL}/api/signup`)
      .send({username: 'whatsinaname'})
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(400);
        done();
      })
      .catch(done);
    });

    it('bad endpoint should respond with 404 status', done => {
      superagent.post(`${baseURL}/api/singingintherain`)
      .send({})
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(404);
        done();
      })
      .catch(done);
    });

    describe('POST username or email already taken', function() {
      before(done => {
        superagent.post(`${baseURL}/api/signup`)
        .send({
          username: 'han',
          password: 'falcon',
          email: 'gotabadfeelin@holo.net',
        })
        .then(() => done())
        .catch(done);
      });
      it('should respond with 409 conflict', done => {
        superagent.post(`${baseURL}/api/signup`)
        .send({
          username: 'luke',
          password: 'xwing',
          email: 'gotabadfeelin@holo.net',
        })
        .then(done)
        .catch(err => {
          expect(err.status).to.equal(409);
          done();
        })
        .catch(done);
      });
    });
  });
  describe('testing GET /api/login', function () {
    before(userMock.bind(this));
    it('should respond with a token', (done) => {
      superagent.get(`${baseURL}/api/login`)
      .auth(this.tempUser.username, '1234')
      .then(res => {
        expect(res.status).to.equal(200);
        expect(Boolean(res.text)).to.equal(true);
        done();
      })
      .catch(done);
    });
    it('incorrect password should respond with 401 unauthorized', (done) => {
      superagent.get(`${baseURL}/api/login`)
      .auth(this.tempUser.username, '4321')
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(401);
        done();
      })
      .catch(done);
    });
    it('no auth header set should respond with 401', done => {
      superagent.get(`${baseURL}/api/login`)
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(401);
        done();
      })
      .catch(done);
    });
  });

  describe('testing DELETE /api/leave', function() {
    beforeEach(userMock.bind(this));
    it('should respond with 204 no content', done => {
      superagent.delete(`${baseURL}/api/leave`)
      .set('Authorization', `Bearer ${this.tempToken}`)
      .then(res => {
        expect(res.status).to.equal(204);
        done();
      })
      .catch(done);
    });

    it('should respond with 401 unauthorized', done => {
      superagent.delete(`${baseURL}/api/leave`)
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(401);
        done();
      })
      .catch(done);
    });

    it('should respond with 404 not found', done => {
      superagent.delete(`${baseURL}/api/quit`)
      .set('Authorization', `Bearer ${this.tempToken}`)
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(404);
        done();
      })
      .catch(done);
    });
  });

});
