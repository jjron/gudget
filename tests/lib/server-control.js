'use strict';

const server = require('../../server.js');
const serverControl = module.exports = {};

serverControl.startServer = function(done) {
  if(!server.isRunning) {
    server.listen(process.env.PORT, () => {
      server.isRunning = true;
      console.log('server up!');
      done();
    });
    return;
  }
  done();
};

serverControl.killServer = function(done) {
  if(server.isRunning) {
    server.close(() => {
      server.isRunning = false;
      console.log('server down!');
      done();
    });
    return;
  }
  done();
};
