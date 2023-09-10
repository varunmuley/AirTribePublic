const { dbContext } = require('../db-helper');
const { DataTypes } = require("sequelize");
const MovieShow = require('./movie-show');
const Theatre = require('./theater');

const TheaterSlot = dbContext.define('TheaterSlot', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true
    },
    slotTime: {
        type: DataTypes.TIME
    },
    availableSeats: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

MovieShow.hasMany(TheaterSlot);
TheaterSlot.belongsTo(MovieShow);


module.exports = TheaterSlot;