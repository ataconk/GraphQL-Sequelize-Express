const {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLString
} = require('graphql');
const { attributeFields } = require('graphql-sequelize');
const db = require('../index');
const UserGroup = require('./index')(db.sequelize);

module.exports = new GraphQLObjectType({
    name: 'UserGroup',
    description: 'User',
    fields: attributeFields(UserGroup)
});
