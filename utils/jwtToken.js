const jwt = require("jsonwebtoken")

exports.getJwtToken = (payload, expire = process.env.JWT_EXPIRES_IN) => {
    token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: expire
    });
}