const jwt = require('jsonwebtoken');

const authMiddleware = function(req, res, next) {
    const jwtToken = req.headers.authentication;
    if (!jwtToken) {
        return res.send('No authorization token provided').status(401);
    } 
    jwt.verify(jwtToken, "API_SECRET_KEY_HERE", (err, decode) => {
        if(err == null) {
            console.log('Auth token verifed successfully, ');
            if (decode.id) {
                req.loggedInUser = decode.id;
            } else {
                req.loggedInUser = null;
            }
            next();
        } else {
            return res.status(401).send('Invalid token'); 
        }
    });
}


module.exports = [authMiddleware];