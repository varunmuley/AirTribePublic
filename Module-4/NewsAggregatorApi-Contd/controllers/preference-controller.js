const User = require("../models/user");

const getPreferences = async (req, res) => {
    try {
        const loggedInUser = req.loggedInUser;
        const userObj = await User.findOne({ email: loggedInUser});
        if (userObj?.preferences?.length > 0) {
            return res.send(userObj.preferences).status(200);
        }
        return res.send([]).status(200);
    } catch(err) {
        console.log(err);
        res.send('[Internal server error] Unable to fetch preferences, something went wrong.').status(500);
    }
};

const updatePreferences = async (req, res) => {
    try {
        const loggedInUser = req.loggedInUser;
        const preferences = req.body.preferences;
        const userObjToUpdate = await User.findOne({ email: loggedInUser});
        userObjToUpdate.set({'preferences': preferences});
        await userObjToUpdate.save();
        res.send('Preferences updated succesfully');
    } catch(err) {
        console.log(err);
        res.send('[Internal server error] Unable to update preferences, something went wrong.').status(500);
    }
};

module.exports = {getPreferences, updatePreferences};