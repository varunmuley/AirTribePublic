const { initConnection } = require("./db-helper");
const express = require('express');
const theaterRoutes = require('./routes/theatre-routes');
const movieRoutes = require('./routes/movie-routes');

initConnection().then(() => {
    console.log('DB connection succesfull');
}).catch(err => {
    console.log('Something went wrong');
});

const server = express();

server.use('/theater', theaterRoutes);
server.use('/movie', movieRoutes);

server.listen(3000, () => {
    console.log('Server started');
});

