const bcrypt = require('bcrypt-nodejs');
const { v4 } = require('uuid');
const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    // By defining the primary key here we are forcing it to use a unique identifier
    id: {
      primaryKey: true,
      type: DataTypes.STRING,
      defaultValue: () => v4()
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,

    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      isUnique: true,
      validate: {
        isEmail: true,
        isUnique: function (value, next) {
          var self = this;
          User.find({ where: { email: value }, attributes: ['id'] })
            .then(function (User) {
              // reject if a different user wants to use the same email
              if (User && self.id !== User.id) {
                return next('This email is already in use!!');
              }
              return next();
            })
            .catch(function (err) {
              return next(err);
            });
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_login_date:{
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    confirmed: {
      type:DataTypes.BOOLEAN,
      defaultValue: false,
    },
    resetPassToken:{
      type:DataTypes.STRING,
    },
    resetPassExpires: {
      type:DataTypes.DATE,
    },
    // imageData: {
    //   type:DataTypes.BLOB,
    // },
    imagePath: {
      type:DataTypes.STRING
    }
  },
    {
      hooks: {
        beforeCreate(user) {
          return cryptPassword(user.password)
            .then(success => user.password = success)
            .catch(err => err && console.error(err));
        }
      }
    });
  User.associate = function (models) {
    /*User.belongsToMany(models.Company, {
      through: {
        model: models.UserCompany,
        unique: false
      },
      foreignKey: 'userId',
      constraints: false
    });*/
    User.hasMany(models.UserCompany, { foreignKey: 'userId', });
    User.hasMany(models.UserGroupUser, { foreignKey: 'userId', });
    
    
  };
  return User;
};
function cryptPassword(password) {
  return new Promise(function (resolve, reject) {
    bcrypt.genSalt(10, function (err, salt) {
      // Encrypt password using bycrpt module
      if (err) return reject(err);
      bcrypt.hash(password, salt, null, function (err, hash) {
        if (err) return reject(err);
        return resolve(hash);
      });
    });
  });
}

