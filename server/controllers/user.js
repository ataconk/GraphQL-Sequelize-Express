const User = require('../models/user').Index;
const  Company = require('../models/company').Company;

module.exports = {
  create(req, res) {
    return User
      .create({
        user_name: req.body.user_name,
      })
      .then(users => res.status(201).send(users))
      .catch(error => res.status(400).send(error));
  },

  retrieve(req, res) {
    return Todo
      .findById(req.params.todoId, {
        include: [{
          model: TodoItem,
          as: 'todoItems',
        }],
      })
      .then(todo => {
        if (!todo) {
          return res.status(404).send({
            message: 'Todo Not Found',
          });
        }
        return res.status(200).send(todo);
      })
      .catch(error => res.status(400).send(error));
  },
  list(req, res) {
    return User
      .findAll({
        include: [{
          model: Company,
        }],
      })
      .then(users => res.status(200).send(users))
      .catch(error => res.status(400).send(error));
  },

  update(req, res) {
    return User
      .findById(req.params.userId, {
        include: [{
          model: Company,
        }],
      })
      .then(user => {
        if (!user) {
          return res.status(404).send({
            message: 'User Not Found',
          });
        }
        return user
          .update({
            user_name: req.body.user_name || user.user_name,
          })
          .then(() => res.status(200).send(user))  
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  destroy(req, res) {
    return User
      .findById(req.params.userId)
      .then(user => {
        if (!user) {
          return res.status(400).send({
            message: 'User Not Found',
          });
        }
        return user
          .destroy()
          .then(() => res.status(204).send())
          .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
  },
};