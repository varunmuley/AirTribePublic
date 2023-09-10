const Theater = require('../models/theater');

const fetchTheatersByCity = async function (cityName) {
    try {
        if (cityName) {
            const filteredTheater = await Theater.findAll({
                where: {
                    city : cityName
                }
            });
            return filteredTheater;
        }
        else {
            const allTheater = await Theater.findAll();
            return allTheater;
        }
    } catch (err) {
        throw err;
    }
};

module.exports = {fetchTheatersByCity};