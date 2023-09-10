const Movie = require('../models/movie');

const fetchAllMovies = async function () {
    try {
        const allMovies = await Movie.findAll();
        return allMovies;
    } catch (err) {
        throw err;
    }
};

const fetchMoviesByGenre = async function (genre) {
    try {
        const movies = await Movie.findAll({
            where: {
                genre: genre
            }
        });
        return movies;
    } catch (err) {
        throw err;
    }
};

module.exports = {fetchAllMovies, fetchMoviesByGenre};