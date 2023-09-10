const router = require('express').Router();
const theaterController = require('../controllers/theater-controller');

router.get('/', theaterController.getTheaters);

module.exports = router;