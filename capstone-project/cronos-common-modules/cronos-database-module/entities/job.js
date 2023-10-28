const { dbContext } = require('../database');
const { DataTypes } = require("sequelize");

const Job = dbContext.define('Job', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    payload: {
        type: DataTypes.STRING,
        allowNull: false
    },
    payload_type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    frequency: {
        type: DataTypes.STRING,
        allowNull: false
    },
    interval: {
        type: DataTypes.STRING,
        allowNull: true
    },
    max_retry: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    next_scheduled_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
});

module.exports = Job;