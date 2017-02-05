'use strict';

process.env.PORT=4000;
process.env.MONGODB_URI='mongodb://localhost/testing';
process.env.APP_SECRET='mock-app-secret';


const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
