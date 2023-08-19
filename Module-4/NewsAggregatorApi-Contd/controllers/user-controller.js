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
    const response = await userService.login(req.body);
    if (!response) {
        return res.status(404).send({ message: "User Not found." });
    }
    res.set('token',response.token);
    if (!response.isAuthorised) {
        return res.status(401)
        .send(response.isAuthorised);
    } else {
        return res.status(200)
        .send(response.isAuthorised);
    }
};

module.exports = {login, register};