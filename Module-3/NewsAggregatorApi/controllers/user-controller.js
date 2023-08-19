const userService = require('../services/user-service');

const register = async (req, res) => {
    try {
        const userObj = req.body;
        let responseObj = {};
        const registeredUser = await userService.createUser(userObj);

        if (registeredUser) {
            responseObj =  {
                fullName: registeredUser.fullName,
                email: registeredUser.email,
                preferences: registeredUser.preferences
            };
        }

        res.status(200).send({ message: "User registered successfully", user: registeredUser});
    } catch (err) {
        console.log(`[Error] Internal server error. Error: ${err}`);
        res.status(500).send({ message: "User registration failed", user: registeredUser});
    }
};

const login = async (req, res) => {
    const user = await userService.login(req.body);
    if (!user) {
        return res.status(404).send({ message: "User Not found." });
    }
    
};

module.exports = {login, register};