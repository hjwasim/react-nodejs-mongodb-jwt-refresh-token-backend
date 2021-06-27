const jwt = require('jsonwebtoken')

const verifyJwt = (req, res, next) => {

    let auth = req.headers.cookie.split(" ")
    const access_token = auth[1].split("=")[1].replace(";", "")
    const refresh_token = auth[0].split("=")[1].replace(";", "")

    if (!access_token) {
        return res.send({ error: "No token provided!" });
    }
    if (!refresh_token) {
        return res.send({ error: "No token provided!" });
    }

    jwt.verify(access_token, process.env.ACCESS_TOKEN_KEY, (err, decoded) => {
        if (err && err.name === 'TokenExpiredError') {
            next();
        }
        if (decoded)
            next();
    });
};

module.exports = verifyJwt