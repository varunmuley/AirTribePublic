require('dotenv').config();
const express = require('express');
const newsRoutes = require('./routes/news-routes');
const userRouter = require('./routes/user-routes');
const preferenceRouter = require('./routes/preference-routes');
const dbService = require('./services/db-service');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3001;

//Connect to database
dbService.init();

const server = express();

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true }));

server.use(userRouter);
server.use(preferenceRouter);
server.use('/news', newsRoutes);

server.listen(PORT, (error) => {
    if (!error)
        console.log('Server started successfully, listening at port: ', PORT);
    else
        console.log('Something went wrong. Server failed to start. ', error);
});