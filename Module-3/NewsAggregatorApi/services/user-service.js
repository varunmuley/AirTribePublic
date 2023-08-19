const axios = require('axios');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

// Register new user
async function registerUser(user) {
    try {
        const data = await user.save();
        console.log(`[Internal] User registered successfully. User details: ${data}` );
        res.status(200).send({ message: "User registered successfully" });
    } catch (err){
        console.log(`[Error] user-service->registerUser, Error: ${err}` );
        res.status(500).send({ message: "User registration failed" });
    }
}

async function login(userObject) {
    try {
        const user = await User.findOne({ email: userObject.email});
        if (!user) {
            return null;
        }

        //comparing passwords
        const passwordIsValid = bcrypt.compareSync(
            userObject.password,
            user.password
        );
        // checking if password was valid and send response accordingly
        if (!passwordIsValid) {
            return res.status(401)
            .send({
                accessToken: null,
                message: "Invalid Password!"
            });
        }
        //signing token with user id
        const token = jwt.sign({
            id: user.email
        }, "API_SECRET_KEY_HERE", { // TODO: Use process env variables for API_SECRET
            expiresIn: 86400
        });
        return user;
} catch (err) {
        console.log(`[Internal] Internal server error. Error: ${err}` );
        res.status(500).send({ message: "User login failed" });
    }
}

module.exports = { registerUser, login };