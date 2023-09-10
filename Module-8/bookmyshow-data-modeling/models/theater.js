const { dbContext } = require('../db-helper');
const { DataTypes } = require("sequelize");

const Theater = dbContext.define('Theater', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    locationCoordintes: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports =  Theater;