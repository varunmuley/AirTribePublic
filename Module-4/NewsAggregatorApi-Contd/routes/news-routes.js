const bodyParser = require('body-parser');
const newsRoutes = require('express').Router();
const fetchNewsForUser = require('../controllers/news-controller');
const authMiddleware = require('../middlewares/auth-middleware');

newsRoutes.use(bodyParser.urlencoded({ extended: false }));
newsRoutes.use(bodyParser.json());

newsRoutes.use(authMiddleware).get('/', fetchNewsForUser);

module.exports = [newsRoutes];
