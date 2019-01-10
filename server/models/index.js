"use strict";
var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var env = process.env.NODE_ENV || "development";
var config = require(path.join(__dirname, '..', 'config', 'db.js'))[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);


const db = require('../helpers/db').up();
module.exports = db;
exports.User = require('./user');
exports.UserGroup = require('./usergroup');
exports.Company = require('./company');



