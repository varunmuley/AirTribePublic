require('dotenv').config();
const { Sequelize } = require('sequelize');

// Initialize postgres db connection
const dbContext = new Sequelize(process.env.DB_CONNECTION_STRING);

async function initConnection() {
    try {
        await dbContext.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

module.exports = {
    initConnection,
    dbContext
};