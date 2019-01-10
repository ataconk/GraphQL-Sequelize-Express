const { v4 } = require('uuid'); //A better way to define primary keys than normal integers
const { DataTypes, sequelize } = require('sequelize');

module.exports = (sequelize) => {
  const UserGroup = sequelize.define('UserGroup', {
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
          UserGroup.find({ where: { name: value }, attributes: ['id'] })
            .then(function (UserGroup) {
              // reject if a different user wants to use the same email
              if (UserGroup && self.id !== UserGroup.id) {
                return next('This group name is already in use!!');
              }
              return next();
            })
            .catch(function (err) {
              return next(err);
            });
        }
      }

    },
    companyId:{
      type: DataTypes.STRING,
      allowNull: false
    },

  });
  UserGroup.associate = function (models) {
    UserGroup.belongsTo(models.Company, { foreignKey: 'companyId', onDelete: 'CASCADE' });
    // UserGroup.hasMany(models.UserGroupBot, {  foreignKey: 'usergroupId', })
    UserGroup.hasMany(models.UserGroupUser, { foreignKey: 'usergroupId', });
  };
  return UserGroup;
};