const Company = require('../models/company');

module.exports = {
  create(req, res) {
    return Company
      .create({
        company_name: req.body.company_name,
        userId: req.params.userId,
      })
      .then(companies => res.status(201).send(companies))
      .catch(error => res.status(400).send(error));
  },

  list(req, res) {
    return Company
      .all()
      .then(companies => res.status(200).send(companies))
      .catch(error => res.status(400).send(error));
  },


  update(req, res) {
    return Company
      .find({
          where: {
            id: req.params.companyId,
            userId: req.params.userId,
          },
        })
      .then(company => {
        if (!company) {
          return res.status(404).send({
            message: 'Company Not Found',
          });
        }
  
        return company
          .update({
            company_name: req.body.company_name || company.company_name,
            assigned_touser: req.body.assigned_touser|| company.assigned_touser,
          })
          .then(updatedCompany => res.status(200).send(updatedCompany))
          .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
  },
  
  destroy(req, res) {
    return Company
      .find({
          where: {
            id: req.params.companyId,
            userId: req.params.userId,
          },
        })
      .then(company => {
        if (!company) {
          return res.status(404).send({
            message: 'Company Not Found',
          });
        }
  
        return company
          .destroy()
          .then(() => res.status(204).send())
          .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
  },
};