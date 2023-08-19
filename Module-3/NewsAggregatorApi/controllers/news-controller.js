const newsService = require('../services/news-service');
const User = require("../models/user");

const fetchNewsForUser = async function (req, res) {
    try {
        const loggedInUser = req.loggedInUser;
        const userObj = await User.findOne({email: loggedInUser});
        const categories = userObj.preferences;
        const news = await newsService.fetchNewsArticlesByCategory(categories);
        return res.status(200).send(news);
    }  catch (err) {
        console.log(`[Error] Internal server error. Error: ${err}`);
        res.status(500).send({ message: "Fetching news failed for user.", user: registeredUser});
    }
}

module.exports = [fetchNewsForUser];