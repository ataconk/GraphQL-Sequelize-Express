const {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLString
} = require('graphql');
const { attributeFields } = require('graphql-sequelize');
const db = require('../index');
const UserGroupUser = require('./index')(db.sequelize);

module.exports = new GraphQLObjectType({
    name: 'UserGroupUser',
    description: 'UserGroup User Relation',
    fields: attributeFields(UserGroupUser)
});