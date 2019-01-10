const models = require('../models')

module.exports = function (app,passport) {
  require('./auth')(app,passport);
  require('./graphql')(app,passport);
  // require('./express')(app);
}
