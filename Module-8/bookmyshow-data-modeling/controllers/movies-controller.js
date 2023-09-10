const movieService = require('../services/movie-service');

const getAllMovies = async (req, res) => {
    try {
        const movies = await  movieService.fetchAllMovies();
        res.status(200).send({ movies: movies});
    } catch (err) {
        console.log(`[Internal Server Error] getAllMovies: ${JSON.stringify(err)}`);
        res.status(500).send('Unable to fetch movies. Something went wrong.')
    }
};

const getMovies = async (req, res) => {
    try {
        const genre = req.query.genre;
        const movies = await  movieService.fetchMoviesByGenre(genre);
        res.status(200).send({ movies: movies});
    } catch (err) {
        console.log(`[Internal Server Error] getMovies: ${JSON.stringify(err)}`);
        res.status(500).send('Unable to fetch movies. Something went wrong.')
    }
};

module.exports = {getAllMovies, getMovies};