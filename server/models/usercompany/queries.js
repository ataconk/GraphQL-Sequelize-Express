const {
    GraphQLNonNull,
    GraphQLString,
    GraphQLList
} = require('graphql');
const { Op: { iLike } } = require('sequelize');
const { resolver } = require('graphql-sequelize');
const userCompanyType = require('./type');
const sort = require('../../helpers/sort');


module.exports = ({ UserCompany }) => ({
});