require('dotenv').config();

// To initialize and register containerised services.
require('./services/container');

const express = require('express');
const userRouter = require('./routes/user-routes');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const { database } = require('../cronos-common-modules/cronos-database-module/');
const jobsRouter = require('./routes/jobs-routes');


try {
    //Connect to database
    database.initConnection();

    const server = express();

    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({extended: true }));

    server.use(userRouter);
    server.use(jobsRouter);

    server.listen(PORT, (error) => {
        if (!error)
            console.log('[Success] Server started successfully, listening at port: ', PORT);
        else
            console.log(`[Failed] Something went wrong. Server failed to start. Error: ${JSON.stringify(error)}`);
    });
} catch(error) {
    console.log(`[Failed] Something went wrong. Server failed to start. Error: ${JSON.stringify(error)}`);
}
