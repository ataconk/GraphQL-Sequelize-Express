const {
    GraphQLNonNull,
    GraphQLString
} = require('graphql');
const usergroupUserType = require('./type');
const { resolver } = require('graphql-sequelize');
const deleteType = require('../../helpers/types/delete');
const UserTypes = require('../usercompany/userTypes')


module.exports = ({ UserGroup, User, UserGroupUser , UserCompany}) => ({

    addUsertoGroup: {
        type: usergroupUserType,
        args: {
          
          userId: {
            description: 'ID of the user that will be added to the company',
            type: new GraphQLNonNull(GraphQLString)
          },
          usergroupId: {
            description: 'ID of the company which user will be linked',
            type: new GraphQLNonNull(GraphQLString)
          }
         
        },
  
          resolve: async function (root, {  userId, usergroupId,   }, context, info) {
            let uid = context.user.id;
            const usergroup = await UserGroup.findOne({
                where: {id: usergroupId}
            })
           
            if (usergroup !== undefined && usergroup!== null ) {
            const user = await User.findOne({
              where: { id: userId}
              
            }) 

            if (user !== undefined && user!== null ) {
            const usercompany = await UserCompany.findOne({
                where: { userId: uid, 
                         type: UserTypes.admin,  
                         companyId:usergroup.companyId
                        }
            });
            if (usercompany !== undefined && usercompany!== null ) {
                    const usergroupuser = await UserGroupUser.create({
                      userId,
                      usergroupId,
                    })
                    return await resolver(UserGroupUser)(root, { id: usergroupuser.id,  userId,usergroupId}, context, info);
                  }
              else{
                return null
              }
            }else{
              return console.log(" User not found")
            }
          }
          else{
            return console.log("user group not exist")

          }}
        },
});