const {
  GraphQLNonNull,
  GraphQLString

} = require('graphql');
const deleteType = require('../../helpers/types/delete');
const companyType = require('./type');
const { resolver } = require('graphql-sequelize');
const UserTypes = require('../usercompany/userTypes');

module.exports = ({ Company, UserCompany }) => ({
  createCompany: {
    type: companyType,
    args: {
      name: {
        description: ' company_name',
        type: new GraphQLNonNull(GraphQLString)
      }
    },
    resolve: async function (root, { name }, context, info) {
      let uid = context.user.id;
      const company = await Company.create({
        name,
        UserCompanies: [{
          userId: uid,
          type: UserTypes.admin
        }]
      }, {
          include: [UserCompany]
        }).catch(function (err) {
          console.log(err.errors);
          throw new Error('USER NAME IS ALREADY IN USE')
        });
      return await resolver(Company)(root, { id: company.id }, context, info);
    }
  },
  updateCompany: {
    type: companyType,
    args: {
      id: {
        description: 'ID of company',
        type: new GraphQLNonNull(GraphQLString)
      },
      name: {
        description: 'Name of company',
        type: GraphQLString

      }
    },
    resolve: async function (root, { id, name }, context, info) {
      let uid = context.user.id;
      const company = await Company.findOne({
        include: [{
          model: UserCompany,
          where: { userId: uid, type: UserTypes.admin }
        }],
        where: {
          id: id,
          
        }
      });
      if (company !== undefined) {
        
        company.name = name;
        company.save().then(() => { });
        return await resolver(Company)(root, { id: company.id}, context, info);
      } else {
        throw new Error('ERROR OCCURED'); // We should return a united error
      }
    }
  },
  deleteCompany: {
    type: deleteType,
    args: {
      id: {
        description: 'ID of company',
        type: new GraphQLNonNull(GraphQLString)
      }
    },
    resolve: async function (root, { id }, context, info) {
      let uid = context.user.id;
      const company = await Company.findOne({
        include: [{
          model: UserCompany,
          where: { userId: uid, type: UserTypes.admin }
        }],
        where: {
          id: id,
          
        }
      });

      if (company !== undefined) {
        company.destroy();
        company.set('isDeleted', true).save();
        return { success: true };
      }else{
        return {
          success: false
        };
      }
      
      
      
    }
  }
});