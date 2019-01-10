const {
  GraphQLNonNull,
  GraphQLString

} = require('graphql');
const deleteType = require('../../helpers/types/delete');
const userCompanyType = require('./type');
const { resolver } = require('graphql-sequelize');
const UserTypes = require('./userTypes');

module.exports = ({ UserCompany,User }) => ({
    addUsertoCompany: {
      type: userCompanyType,
      args: {
        
        type: {
          description: 'type of user',
          type: new GraphQLNonNull(GraphQLString)
        },
        email: {
          description: 'Email of the user that will be added to the company',
          type: new GraphQLNonNull(GraphQLString)
        },
        companyId: {
          description: 'ID of the company which user will be linked',
          type: new GraphQLNonNull(GraphQLString)
        }
       
      },

        resolve: async function (root, { type, email,companyId,   }, context, info) {
          let uid = context.user.id;
          console.log('USER ID IS HEREEEE'+uid)
          // const user = await User.findOne({
          //   where: { id: userId}
          // })
          const  user =  await User.findOne({
            where: {email:email}
          });
          if (user !== undefined && user!== null ) {
          const usercompanyr = await UserCompany.findOne({
              where: { userId: uid, 
                       type: UserTypes.admin,  
                       companyId:companyId 
                      }
          });
          console.log('COMPANYYYY'+usercompanyr)
          if (usercompanyr !== undefined && usercompanyr!== null ) {
                if(type=='admin' || type=='Admin'|| type== 'ADMIN'){
                  const usercompany = await UserCompany.create({
                    type: UserTypes.admin,
                    userId:user.id,
                    companyId,
                  })
                  return await resolver(UserCompany)(root, { id: usercompany.id, type,  email,companyId }, context, info);
                  
                }else{
                  const usercompany = await UserCompany.create({
                  type: UserTypes.user,
                  userId: user.id,
                  companyId,
                })
                return await resolver(UserCompany)(root, { id: usercompany.id, type, email,companyId }, context, info);

                }
              }
            else{
              return null
            }

          }else{
            return message(" User not found")
          }}
      },
      updateUsertype: {
        type: userCompanyType,
        args: {
          type: {
            description: 'type of user to be',
            type: new GraphQLNonNull(GraphQLString)
          },
          userId: {
            description: 'ID of user',
            type: new GraphQLNonNull(GraphQLString)
          },
          companyId: {
            description: 'ID of company',
            type: new GraphQLNonNull(GraphQLString)
          }

          
        },
        resolve: async function (root, { type, userId, companyId }, context, info) {
          let uid = context.user.id;
          const user = await User.findOne({
            where: { id: userId}
          })
          
          if (user !== undefined && user!== null ) {
          const usercompanyr = await UserCompany.findOne({
              where: { userId: uid, 
                       type: UserTypes.admin,  
                       companyId:companyId 
                      }
          });
          if (usercompanyr !== undefined && usercompanyr!== null ) {
            const usercompany = await UserCompany.findOne({
              where: { userId: userId, 
                       companyId:companyId 
                      }
                    });
              if (usercompany !== undefined && usercompany!== null ) {
                if(type=='admin' || type=='Admin'|| type== 'ADMIN'){
                usercompany.type = UserTypes.admin;
                usercompany.save().then(() => { });
                return await resolver(UserCompany)(root, { id: usercompany.id, type, userId, companyId }, context, info);
              }else{
                usercompany.type = UserTypes.user;
                usercompany.save().then(() => { });
                return await resolver(UserCompany)(root, { id: usercompany.id, type, userId, companyId }, context, info);

              }
        }else{
          return message('user is not belonged any company')
        }
         } else {
            return null; // We should return a united error
          }
        } else {
          return message("user not found")
        }
      }
    },

      
        
});