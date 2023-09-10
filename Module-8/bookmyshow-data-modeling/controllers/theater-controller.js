const theaterService = require('../services/theatre-service');

const getTheaters = async (req, res) => {
    try {
        const city = req.query.city;
        const theaters = await  theaterService.fetchTheatersByCity(city);
        res.status(200).send({ theaters: theaters});
    } catch (err) {
        console.log(`[Internal Server Error] getTheaters: ${JSON.stringify(err)}`);
        res.status(500).send('Unable to fetch theateres. Something went wrong.')
    }
};

module.exports = {getTheaters};