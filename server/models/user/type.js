const {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLString,
    GraphQLList
} = require('graphql');
const { attributeFields } = require('graphql-sequelize');
const db = require('../index');
const User = require('./index')(db.sequelize);
const CompanyType = require('../company/type');
const {resolver} = require('graphql-sequelize');

module.exports = new GraphQLObjectType({
    name: 'User',
    description: 'User',
    fields: attributeFields(User),
        // userCompany: {
        //     type: new GraphQLList(CompanyType),
        //     resolve: resolver(User)
        // }
    
});
