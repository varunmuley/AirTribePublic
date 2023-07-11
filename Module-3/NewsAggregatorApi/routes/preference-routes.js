const bodyParser = require('body-parser');
const preferenceRouter = require('express').Router();
const preferenceController = require('../controllers/preference-controller');
const authMiddleware = require('../middlewares/auth-middleware');

preferenceRouter.use(bodyParser.urlencoded({ extended: false }));
preferenceRouter.use(bodyParser.json());

preferenceRouter.use(authMiddleware).get('/preferences', preferenceController.getPreferences);
preferenceRouter.use(authMiddleware).put('/preferences', preferenceController.updatePreferences);

module.exports = preferenceRouter;