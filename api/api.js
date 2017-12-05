const express = require('express');
const apiRouter = express.Router();

//import Routers
const employeesRouter = require('./employees');
const menusRouter = require('./menus');
apiRouter.use('/employees', employeesRouter);
apiRouter.use('/menus', menusRouter);

module.exports = apiRouter;
