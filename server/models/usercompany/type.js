const {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLString
} = require('graphql');
const { attributeFields } = require('graphql-sequelize');
const db = require('../index');
const UserCompany = require('./index')(db.sequelize);

module.exports = new GraphQLObjectType({
    name: 'UserCompany',
    description: 'User Company Relation',
    fields: attributeFields(UserCompany)
});