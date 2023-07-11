const express = require('express');
const mongoose = require('mongoose');
const newsRoutes = require('./routes/news-routes');
const userRouter = require('./routes/user-routes');
const preferenceRouter = require('./routes/preference-routes');

//Connect to database
try {
    mongoose.connect("mongodb://localhost:27017/testDB", {
        useUnifiedTopology: true,
        useNewUrlParser: true
    });
    console.log("connected to db");
} catch (error) {
    console.log(error);
}

const server = express();

server.use(express.json());
server.use(express.urlencoded({extended: true }));

server.use(userRouter);
server.use(preferenceRouter);
server.use('/news', newsRoutes);

server.listen('3000', (error) => {
    if (!error)
        console.log('Server started successfully, listening at port: 3000');
    else
        console.log('Something went wrong. Server failed to start. ', error);
});