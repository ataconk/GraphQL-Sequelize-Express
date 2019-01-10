const db = require('./index');
const modelKeys = require('../config/models');

module.exports = modelKeys.map((val) => val.toLowerCase()).reduce(
  ({ queries, mutations }, model) => ({
    //Splat all queries and mutations on the top level
    queries: {
      ...require(`./${model}/queries`)(db),
      ...queries
    },
    mutations: {
      ...require(`./${model}/mutations`)(db),
      ...mutations
    }
  }),
  { queries: {}, mutations: {} }
);