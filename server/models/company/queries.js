const {
    GraphQLNonNull,
    GraphQLString,
    GraphQLList
} = require('graphql');
const { Op: { iLike } } = require('sequelize');
const { resolver } = require('graphql-sequelize');
const companyType = require('./type');
const sort = require('../../helpers/sort');


module.exports = ({ Company, UserCompany, User }) => ({
    company: {
        type: companyType,
        args: {
            id: {
                description: 'ID of company',
                type: new GraphQLNonNull(GraphQLString)
            }
        },
        resolve: resolver(Company, {
            after: result => result.length ? result[0] : result
        })
    },
    companies: {
        type: new GraphQLList(companyType),
        resolve: async function (root, { name }, context, info) {
            let uid = context.user.id;

            return await resolver(Company, {
                dataLoader: false,
                before: (findOptions, args) => ({
                    include: [{
                        model: UserCompany,
                        where: { userId: uid }
                    }],
                    order: [['name', 'ASC']],
                    ...findOptions
                }),
                after: sort
            })(root, { where: {} }, context, info);
        }
    },
    companySearch: {
        type: new GraphQLList(companyType),
        args: {
            query: {
                description: 'Fuzzy-matched name of company',
                type: new GraphQLNonNull(GraphQLString)
            }
        },
        resolve: resolver(Company, {
            dataLoader: false,
            before: (findOptions, args) => ({
                where: {
                    name: { [iLike]: `%${args.query}%` },
                },
                order: [['name', 'ASC']],
                ...findOptions
            }),
            after: sort
        })
    }
});