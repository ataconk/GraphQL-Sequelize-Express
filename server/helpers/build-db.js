const path = require('path');
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/db.js')[env];
module.exports = function() {
  return new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
};
