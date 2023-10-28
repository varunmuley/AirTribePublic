const { container, TYPES } = require('../services/container');

const userService = container.get(TYPES.UserService);

const register = async (req, res) => {
    try {
        const userObj = req.body;
        const response = await userService.registerUser(userObj);

        let responseObj = {};

        if (response) {
            if (response === 'exists') {
                return res.status(500).send({ message: "User already exits.", user: null});
            }
            responseObj =  {
                id: response.id,
                name: response.name,
                email: response.email,
            };
        }

        res.status(200).send({ message: "User registered successfully", user: responseObj});
    } catch (err) {
        console.log(`[Error] Internal server error. Error: ${err}`);
        res.status(500).send({ message: "User registration failed", user: responseObj});
    }
};

const login = async (req, res) => {
    const response = await userService.login(req.body);
    if (!response) {
        return res.status(404).send({ message: "User Not found." });
    }
    res.set('auth-token',response.token);
    if (!response.isAuthorised) {
        return res.status(401)
        .send(response.isAuthorised);
    } else {
        return res.status(200)
        .send(response.isAuthorised);
    }
};

module.exports = {login, register};