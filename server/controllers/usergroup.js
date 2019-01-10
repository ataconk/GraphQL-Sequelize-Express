const UserGroup = require('../models/usergroup');

module.exports = {
  create(req, res) {
    return UserGroup
      .create({
        group_name: req.body.group_name,
      })
      .then(usergroups => res.status(201).send(usergroups))
      .catch(error => res.status(400).send(error));
  },
  list(req, res) {
    return User
      .all()
      .then(users => res.status(200).send(users))
      .catch(error => res.status(400).send(error));
  },
}