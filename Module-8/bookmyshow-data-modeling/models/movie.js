const { dbContext } = require('../db-helper');
const { DataTypes } = require("sequelize");

const Movie = dbContext.define('Movie', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    genre: {
        type: DataTypes.STRING,
        allowNull: true
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    certificate: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // Delimited flat string (comma seperated) eg: Hindi,English,Marathi
    languages: {
        type: DataTypes.STRING,
        allowNull: true
    },
    // Delimited flat string (comma seperated) eg: 2D,3D,3D-IMAX
    movieTypes: {
        type: DataTypes.STRING,
        allowNull: true
    },
    
});

module.exports = Movie;