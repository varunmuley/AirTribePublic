const { dbContext } = require('../db-helper');
const { DataTypes } = require("sequelize");
const Movie = require('./movie');

const MovieShow = dbContext.define('MovieShow', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true
    },
    language: {
        type: DataTypes.STRING,
        allowNull: false
    },
    movieType: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

Movie.hasMany(MovieShow);
MovieShow.belongsTo(Movie);

module.exports = MovieShow;