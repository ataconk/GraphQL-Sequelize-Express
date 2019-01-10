const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const logger = require('../helpers/logger');
const { NODE_ENV } = process.env;

console.log(NODE_ENV);
module.exports = (app, passport) => {
    const schema = require('../config/ql-schema');

    app.use('/graphql', bodyParser.json(), (req, res, next) => {
        passport.authenticate('jwt', { session: false }, (err, user, info) => {
            if (user) {
                req.user = user
            }
            graphqlExpress({
                schema,
                context: { user: req.user }
            })(req, res, next);
        })(req, res, next);
    });

    if (NODE_ENV === 'development') {
        app.get('/graphiql', graphiqlExpress({
            endpointURL: '/graphql'
        }));
    }

    logger.info(`Running a GraphQL API server at /graphql`);
};
