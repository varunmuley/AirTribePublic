const uuid = require('uuid');
const { dbContext } = require('../database');
const { DataTypes } = require("sequelize");

const User = dbContext.define('User', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    passwordHash: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

User.beforeCreate(user => user.id = uuid.v4());

module.exports = User;