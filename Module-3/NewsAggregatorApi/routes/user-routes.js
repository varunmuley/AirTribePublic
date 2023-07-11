const bodyParser = require('body-parser');
const userRouter = require('express').Router();
const userController = require('../controllers/user-controller');

userRouter.use(bodyParser.urlencoded({ extended: false }));
userRouter.use(bodyParser.json());

userRouter.post('/register', userController.register);
userRouter.post('/login', userController.login)

module.exports = userRouter;