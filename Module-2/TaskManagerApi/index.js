const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const routes = require('express').Router();
const PORT = 3000;

const server = express();

server.use(cors());
server.use(routes);
server.use(bodyParser.json());


routes.get('/', (req, res)=>{
    res.status(200).send("Welcome to the AirTribe Task Manager App");
});

server.listen(PORT, (err) => {
    if(err) {
        console.log('Something went wrong, server failed to start', err);
    } else {
        console.log('Server started succesfully, listening to incoming request at: ', PORT);
    }
});