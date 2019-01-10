const {
  GraphQLNonNull,
  GraphQLString,
  GraphQLList
} = require('graphql');
var bCrypt = require('bcrypt-nodejs');
const userType = require('./type');
const deleteType = require('../../helpers/types/delete');
const { resolver } = require('graphql-sequelize');
var isValidPassword = function (curr_pass, old_password) {
  let result = bCrypt.compareSync(old_password, curr_pass);
  console.log(result);
  return result;
}
module.exports = ({ User }) => ({
  createUser: {
    type: userType,
    args: {
      name: {
        description: 'name',
        type: new GraphQLNonNull(GraphQLString)
      },
      surname: {
        description: 'surname',
        type: new GraphQLNonNull(GraphQLString)
      },
      email: {
        description: 'email of user',
        type: new GraphQLNonNull(GraphQLString)
      },
      password: {
        description: 'password of user',
        type: new GraphQLNonNull(GraphQLString)
      }
    },
    resolve: async function (root, { name, surname, email, password }, context, info) {
      const user = await User.create({
        name: name,
        surname: surname,
        email: email,
        password: bCrypt.hashSync(password, bCrypt.genSaltSync(10), null)
      });
      return await resolver(User)(root, { id: user.id }, context, info);
    }
  },

  updateUsername: {
    type: userType,
    args: {
      name: {
        description: 'Name of user',
        type: GraphQLString
      },
      surname: {
        description: 'Surname of user',
        type: GraphQLString
      }
    },
    resolve: async function (root, { id, name }, context, info) {
      let uid = context.user.id;
      const user = await User.findOne({
        
        where: {
          id: uid,
          
        }
      });
      if (user !== undefined) {
        
        user.name = name;
        user.surname = surname;
        user.save().then(() => { });
        
        return await resolver(User)(root, { id: user.id }, context, info);
        
      } else {
        return null; // We should return a united error
      }
    }
  },

  updatePassword: {
    type: userType,
    args: {
      old_password: {
        description: 'old password of the user',
        type: new GraphQLNonNull(GraphQLString)
      },
      password: {
        description: 'Password of the user',
        type: new GraphQLNonNull(GraphQLString)
      }
    },
    resolve: async function (root, {old_password, password }, context, info) {
      let uid = context.user.id;
    const user = await User.findOne({

      where: {
        id: uid
      }
    });
    
    if (!isValidPassword(user.password, old_password)) {
      return done(null, false, {
          message: 'Incorrect password.'
      });
    }
    
    if(user!== undefined){
      user.password = bCrypt.hashSync(password, bCrypt.genSaltSync(10));
      user.save().then(() => { });
      return await resolver(User)(root, {password},context, info);
      
    } else {
      return null;
    }
    }
  },
  deleteUser: {
    type: deleteType,
    args: {
      id: {
        description: 'ID of user',
        type: new GraphQLNonNull(GraphQLString)
      }
    },
    resolve: async function (root, { id }, context) {
      const { user: { id: userId } } = context;
      if (!id || !userId) return null;

      const user = await User.findOne({
        where: {
          id,
          UserId: userId
        }
      });

      if (!user)
        return {
          success: false
        };

      await user.set('isDeleted', true).save();
      return { success: true };
    }
  },



});

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