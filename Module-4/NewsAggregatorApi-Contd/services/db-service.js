const mongoose = require('mongoose');

function init() {
    try {
        console.log(process.env);
        mongoose.connect(process.env.DB_CONNECTION_STRING, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        console.log("Connected to db");
    } catch (error) {
        console.log("[Error] [DB INIT] Failed to connect to db");
        console.log(error);
    }
}

module.exports = {init};