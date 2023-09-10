const { dbContext } = require('../db-helper');
const { DataTypes, STRING } = require("sequelize");
const Theater = require('./theater');
const TheaterSlot = require('./theater-slot');

const TheaterScreen = dbContext.define('TheaterScreen', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true
    },
    slotTime: {
        type: DataTypes.TIME
    },
    bookedSeatNumbers: {
        type: DataTypes.STRING,
        allowNull: false
    },
    availableSeatNumbers: {
        type: DataTypes.STRING,
        allowNull: false
    },
    seatLayout: {
        type: DataTypes.STRING
    }
});

Theater.hasMany(TheaterScreen);
TheaterScreen.belongsTo(Theater);

TheaterScreen.hasMany(TheaterSlot);
TheaterSlot.belongsTo(TheaterScreen);

module.exports = TheaterScreen;