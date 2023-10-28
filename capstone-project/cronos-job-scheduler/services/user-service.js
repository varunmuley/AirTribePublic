const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require('../../cronos-common-modules/cronos-database-module/entities/user');

class UserService {

    // Register new user
    async registerUser(userObj) {
        try {
            const existingUser = await User.findOne({
                where: {
                    email: userObj.email
                }
            });
            if (existingUser) {
                return "exists";
            }
            const user = User.build({ 
                name: userObj.name,
                email: userObj.email,
                passwordHash: bcrypt.hashSync(userObj.password, 12)
            });
            const savedUser = await user.save();
            return savedUser.dataValues;
        } catch (err){
            console.log(`[Error] user-service->registerUser, Error: ${err}` );
            throw err;
        }
    }

    async login(userObject) {
        try {
            const userResponse = {
                token: null,
                isAuthorised: false
            };

            const user = await User.findOne({
                where: { 
                    email: userObject.email
                }
            });
            if (!user) {
                return null;
            }

            //comparing passwords
            const passwordIsValid = bcrypt.compareSync(
                userObject.password,
                user.dataValues.passwordHash
            );

            //signing token with user id
            const token = jwt.sign({
                id: user.email
            }, process.env.API_SECRET, {
                expiresIn: 86400
            });

            if (passwordIsValid) {
                userResponse.isAuthorised = true;
                userResponse.token = token
            }
            return userResponse;
        } catch (err) {
            console.log(`[Internal] Login Error: ${JSON.stringify(err)}` );
            throw err;
        }
    }
}

module.exports = UserService;