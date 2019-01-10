const { v4 } = require('uuid'); //A better way to define primary keys than normal integers
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserGroupUser = sequelize.define('UserGroupUser', {
    id: {
      primaryKey: true,
      type: DataTypes.STRING,
      defaultValue: () => v4()
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'usergroup_user'
    },
    usergroupId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'usergroup_user'
    }
  });

  UserGroupUser.associate = function (models) {
    UserGroupUser.belongsTo(models.User, { foreignKey: 'userId' });
    UserGroupUser.belongsTo(models.UserGroup, { foreignKey: 'usergroupId' });
  };
  return UserGroupUser;

}