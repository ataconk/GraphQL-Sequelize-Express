const { v4 } = require('uuid'); //A better way to define primary keys than normal integers
const { DataTypes } = require('sequelize');
const UserTypes = require('./userTypes');

module.exports = (sequelize) => {
  const UserCompany = sequelize.define('UserCompany', {
    id: {
      primaryKey: true,
      type: DataTypes.STRING,
      defaultValue: () => v4()
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: () => UserTypes.user
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'user_company'
    },
    companyId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'user_company'
    }
  });
  UserCompany.associate = function (models) {
    UserCompany.belongsTo(models.User, { foreignKey: 'userId' });
    UserCompany.belongsTo(models.Company, { foreignKey: 'companyId' });
  };
  return UserCompany;
};