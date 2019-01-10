const { v4 } = require('uuid'); //A better way to define primary keys than normal integers
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Company = sequelize.define('Company', {
    id: {
      primaryKey: true,
      type: DataTypes.STRING,
      defaultValue: () => v4()
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUnique: function (value, next) {
          var self = this;
          Company.find({ where: { name: value }, attributes: ['id'] })
            .then(function (Company) {
              if (Company && self.id !== Company.id) {
                return next('This name is already in use!!');
              }
              return next();
            })
            .catch(function (err) {
              return next(err);
            });
        }
      }
    },
  });
  Company.associate = function (models) {
    /*Company.belongsToMany(models.User, {
      through: 'UserCompany', 
      foreignKey: 'companyId',
      constraints: false
    });*/
    Company.hasMany(models.UserCompany, { foreignKey: 'companyId' });

    Company.hasMany(models.UserGroup, {
      foreignKey: 'companyId',
    });
    
  };
  return Company;
};