const {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLString
} = require('graphql');
const { attributeFields,  } = require('graphql-sequelize');
const db = require('../index');
const Company = require('./index')(db.sequelize);

module.exports = new GraphQLObjectType({
    name: 'Company',
    description: 'Company',
    fields: attributeFields(Company),
});