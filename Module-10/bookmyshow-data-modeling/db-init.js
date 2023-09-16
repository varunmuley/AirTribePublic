require('dotenv').config();
const crypto = require('crypto');
const { dbContext, initConnection} = require('./db-helper');

const MODELS = require('./models/');

async function initializeDatabase() {
    try {
        await initConnection();
        dbContext.sync().then(async () => {
            console.error("Model synchronized succesfully");
            await insertInitialData();
        }).catch(err => {
            console.error("Error in synchronizing", JSON.stringify(err));
        });
    } catch (err) {
        console.log(err);
    }
}

async function insertInitialData() {
    try {
        const randomMovieData = generateRandomMovieData();
        await MODELS.Movie.bulkCreate(randomMovieData);

        const randomTheaterData = generateRandomTheaterData();
        await MODELS.Theatre.bulkCreate(randomTheaterData);
    } catch(err) {
        console.log(err);
    }
}

function generateRandomMovieData() {
    const movieData = [];

    const genre = ['Action', 'Sci-fi', 'Thriller', 'Romance', 'Suspense'];
    const certificate = ['U', 'U/A', "A"];
    const language= ['Hindi', 'English', 'Marathi'];
    const movieType = ['2D', '3D', 'IMAX', '3D-IMAX'];

    for (let i=0; i < 10000; i++) {
            movieData.push({
                    id: crypto.randomUUID(),
                    name: 'Movie ' + i,
                    year: 2023,
                    description: 'Movie ' + i +' description',
                    genre: genre[Math.floor(Math.random() * genre.length)],
                    certificate: certificate[Math.floor(Math.random() * certificate.length)],
                    movieTypes: movieType[Math.floor(Math.random() * movieType.length)],
                    languages: language[Math.floor(Math.random() * language.length)]
                });
    }
    return movieData;
}

function generateRandomTheaterData() {
    const theaterData = [];

    const city = ['Pune', 'Mumbai', 'Delhi', 'Bengaluru', 'Bhopal'];

    for (let i=0; i < 200; i++) {
        theaterData.push({
                    id: crypto.randomUUID(),
                    name: 'Theater ' + i,
                    city: city[Math.floor(Math.random() * city.length)]
                });
    }
    return theaterData;
}


initializeDatabase();
