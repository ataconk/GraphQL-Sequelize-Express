const userController = require('../controllers').user;
const companyController = require('../controllers').company;
const groupController = require('../controllers').usergroup;

module.exports = (app) => {
    app.get('/api', (req, res) => res.status(200).send({
        message: 'Welcome to the  RESTful API',
    }));
    app.post('/api/user', userController.create);
    app.get('/api/user', userController.list);
    app.put('/api/user/:userId', userController.update);
    app.delete('/api/user/:userId', userController.destroy);
    app.get('/api/user/:userId', userController.retrieve);
    app.post('/api/company', companyController.create);
    app.get('/api/company', companyController.list);
    app.put('/api/user/:userId/company/:companyId', companyController.update);
    app.post('/api/user/:userId/company', companyController.create);
    app.delete('/api/user/:userId/company/:companyId', companyController.destroy);
    app.all('/api/user/:userId/company', (req, res) =>
        res.status(405).send({
            message: 'Method Not Allowed',
        }));
    app.post('/api/usergroup', groupController.create);
    app.get('/api/usergroup', groupController.list);
};