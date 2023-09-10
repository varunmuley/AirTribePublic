const router = require('express').Router();
const movieController = require('../controllers/movies-controller');

router.get('/all', movieController.getAllMovies);
router.get('/', movieController.getMovies);

module.exports = router;