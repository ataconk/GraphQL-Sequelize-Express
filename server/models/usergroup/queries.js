const {
    GraphQLNonNull,
    GraphQLString,
    GraphQLList
} = require('graphql');
const {Op: {iLike} } = require('sequelize');
const { resolver } = require('graphql-sequelize');
const usergroupType = require('./type');
const sort = require('../../helpers/sort');
const UserTypes = require('../usercompany/userTypes');

module.exports = ({UserGroup,Company,UserCompany}) => ({
    usergroup: {
        type: usergroupType,
        args: {
          id: {
              description: 'ID of usergroup',
              type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve: resolver(UserGroup, {
            after: result=> result.lenght ? result[0]: result
        })
    
    },

    usergroups: {
        type: GraphQLList(usergroupType),
        args: {
            companyId: {
                description: 'ID of the company',
                type: new GraphQLNonNull(GraphQLString)
            }
        },resolve: async function (root, { companyId}, context, info) {
            let uid = context.user.id;
            const company = await Company.findOne({
                include: [{
                  model: UserCompany,
                  where:{ userId:uid, type: UserTypes.admin}
                }],
                where: { id:companyId}
              });
              console.log('COMPANY HERE' +company)
              if(company !== undefined && company!== null){
                return await resolver(UserGroup, {
                dataLoader: false,
                
                after: sort
            })(root, { where: {companyId:companyId} }, context, info);
        }else{
            throw new Error('USER IS NOT ADMIN ON THE COMPANY')

        }
        }
    },
    allUsergroups: {
        type: new GraphQLList(usergroupType),
        resolve: resolver(UserGroup)
    },
    usergroupSearch:{
        type: new GraphQLList(usergroupType),
        args: {
            query: {
                description: 'Fuzzy-matched name of user',
                type: new GraphQLNonNull(GraphQLString)
            }
        },

        resolve: resolver(UserGroup, {
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
})