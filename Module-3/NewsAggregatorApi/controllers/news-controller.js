const newsService = require('../services/news-service');
const User = require("../models/user");

const fetchNewsForUser = async function (req, res) {
    const loggedInUser = req.loggedInUser;
    const userObj = await User.findOne({email: loggedInUser});
    const categories = userObj.preferences;
    const news = await newsService.fetchNewsArticlesByCategory(categories);
    return res.status(200).send(news);
}

module.exports = [fetchNewsForUser];