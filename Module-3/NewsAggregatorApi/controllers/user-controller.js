const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const register = (req, res) => {
    const user = new User({
        fullName: req.body.fullName,
        email: req.body.email,
        role: req.body.role,
        password: bcrypt.hashSync(req.body.password, 8)
    });

    // TODO: Ideally this should go in service layer and not in controller
    user.save().then(data => {
        res.status(200)
        .send({ message: "User Registered successfully" });
    }).catch(err => {
        res.status(500)
        .send({ message: err });
        return;
    });
};

const login = (req, res) => {
    // TODO: Ideally this should go in service layer and not in controller
    User.findOne({ email: req.body.email}).then((user) => {
        if (!user) {
            return res.status(404)
            .send({
                message: "User Not found."
            });
        }
        //comparing passwords
        const passwordIsValid = bcrypt.compareSync(
            req.body.password,
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
        //responding to client request with user profile success message and  access token.
        res.status(200)
            .send({
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
            },
            message: "Login successfull",
            accessToken: token,
        });
    }).catch(err => {
        if (err) {
            res.status(500)
            .send({ message: err });
            return;
        }
    });
};

module.exports = {login, register};