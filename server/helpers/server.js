const express = require('express');
const cors = require('cors');
const logger = require('../helpers/logger');
var env = require('dotenv').load();
const app = express();
const passport = require('passport')
var session = require('express-session')
var bodyParser = require('body-parser')
const models = require('../models')
const flash = require('connect-flash');
require('../config/passport')(passport, models.User);

const {
  PORT,
  SESSION_KEY
} = process.env;

 
// // Sync Database
// models.sequelize.sync().then(function() {
 
//     console.log('Nice! Database looks fine')
 
// }).catch(function(err) {
 
//     console.log(err, "Something went wrong with the Database Update!")
 
// });
module.exports = {

  start({
    port = PORT
  } = {}) {
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    /*app.use(session({
      secret: SESSION_KEY,
      resave: true,
      saveUninitialized: true
    }));*/
    // session secret
    app.use(passport.initialize());
    // app.use(passport.session());
    // app.use('/auth', passport.authenticate('jwt', {session: false}), user);
    app.use(flash());
    app.use(require('morgan')({
      "stream": {
        write: function (message, encoding) {
          logger.info(message);
        }
      }
    }));
    var allowedOrigins = ['http://localhost:3000'];
    app.use(cors({
      origin: allowedOrigins,
      credentials: true
    }));
    
    require('../routes')(app, passport);
    this.app = app
    let resolve;
    const listeningPromise = new Promise(res => resolve = res);
    this.server = app.listen(port, () => resolve());
    return listeningPromise;
  },
  stop() {
    this.server.close();
  }
}

