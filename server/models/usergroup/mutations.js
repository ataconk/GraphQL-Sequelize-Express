const {
    GraphQLNonNull,
    GraphQLString
} = require('graphql');
const usergroupType = require('./type');
const { resolver } = require('graphql-sequelize');
const deleteType = require('../../helpers/types/delete');
const companyType = require('../company/type');
const UserTypes= require('../usercompany/userTypes');

module.exports = ({ UserGroup, UserCompany, Company, UserGroupUser }) => ({
    createUserGroup: {
        type: usergroupType,
        args: {
            name: {
                description:'Unique usergroupName',
                type: new GraphQLNonNull(GraphQLString)
            },
            companyId: {
              description:'ID of the related company',
              type: new GraphQLNonNull(GraphQLString)
            }
        },
        
        resolve: async function (root, { name,companyId  }, context, info) {
          let uid = context.user.id;
          console.log('USER ID IS HEREEEE'+uid)
         
          const usercompany = await UserCompany.findOne({
              where: { userId: uid, 
                       type: UserTypes.admin,  
                       companyId:companyId 
                      }
          });
          console.log('COMPANYYYY'+usercompany)
          if (usercompany !== undefined && usercompany!== null ) {
          const usergroup = await UserGroup.create({
            name,
            companyId,
          }); 
          return await resolver(UserGroup)(root, { id: usergroup.id }, context, info);
        }
        else {
          return null; // We should return a united error
        }
      }
      },



      
    deleteUserGroup: {
        type: deleteType,
        args: {
          id: {
            description: 'ID of usergroup',
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve: async function (root, { id  }, context, info) {
          let uid = context.user.id;
          const usergroup = await UserGroup.findOne({
            where: {
              id: id,
            }
          });
          let cid = usergroup.companyId;
          console.log('ID OF THR COMPANYYY'+cid)
          const usercompany = await UserCompany.findOne({
            where: { userId: uid, type: UserTypes.admin,  companyId:cid }
        });
          if (usercompany !== undefined && usercompany!== null ) {
            usergroup.destroy();
            usergroup.set('isDeleted', true).save();
            return { success: true };
          }else{
            return {
              success: false
            };
          }
      
      },
    }
});