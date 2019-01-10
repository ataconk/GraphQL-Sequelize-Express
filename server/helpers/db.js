const buildDb = require('./build-db');
const decorateDb = require('./decorate-db');

var db;
module.exports = {
  up: () => {
    if (!db) {
      db = decorateDb(buildDb());
    }
    return db;
  },
  down: async () => {
    await db.sequelize.close();
    db = null;
  }
};