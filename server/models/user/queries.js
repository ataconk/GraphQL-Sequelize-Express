const {
    GraphQLNonNull,
    GraphQLString,
    GraphQLList,
    GraphQLInt
  } = require('graphql');
  const { Op: {iLike} } = require('sequelize');
  const { resolver } = require('graphql-sequelize');
  const userType = require('./type');
  const sort = require('../../helpers/sort');
  const UserTypes = require('../usercompany/userTypes')

  module.exports = ({ User,UserCompany,Company }) => ({
    user: {
      type: userType,
      args: {
        id: {
          description: 'ID of user',
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve: resolver(User, {
        after: result => result.length ? result[0] : result
      })
    },
    users: {
      type: new GraphQLList(userType),
      args: {
        companyId: {
          description: 'ID of the related Company',
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      

      //resolve: resolver(User)
      resolve: async function (root, {companyId}, context, info){
        let uid = context.user.id;
        console.log("COMPANY ID HEREEEEEE    "+companyId)
        if(companyId==''){
          console.log('YAAAAAAAAAV HEEEEEEEEE')
        }
        const company = await Company.findOne({
          include: [{
            model: UserCompany,
            where:{ userId:uid, type: UserTypes.admin}
          }],
          where: { id:companyId}
        });
        console.log('COMPANY HERE' +company)
        if(company !== undefined && company!== null){
        return await resolver(User, {
        dataLoader:false,
        before: (findOptions, args) => ({
          include: [{
            model:UserCompany,
            where: { 
                     companyId:companyId}
          }],
          order:[['name','ASC']],
          ...findOptions
        }),
        after:sort
      })(root,{  }, context, info);
    }else{
      throw new Error('USER IS NOT ADMIN ON THAT COMPANY OR COMPANY NOT EXIST')
    }
      }
    },
    allUsers:{
      type: new GraphQLList(userType),
      resolve: resolver(User)

    },
    userSearch: {
      type: new GraphQLList(userType),
      args: {
        query: {
          description: 'Fuzzy-matched name of user',
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve: resolver(User, {
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