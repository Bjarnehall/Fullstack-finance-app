const { sign, verify } = require('jsonwebtoken');
const { ACCESS_TOKEN_SECRET } = require('../../keys.js');

/*
Creates a jwt token signed by user id
*/
const createAccessToken = userId => {
    return sign({ userId }, ACCESS_TOKEN_SECRET, {
        expiresIn: '60m',
    })
};
/*
Sends a accestoken to client
*/
const sendAccessToken = (res,req, accesstoken) => {
    res.send ({
        accesstoken,
        email: req.body.email,
    })
};
/*
Check if token is valid and has not expired
*/
const userFromToken = (req) => {
    const authorization = req.headers['authorization'];
    if (!authorization) return null;

    const parts = authorization.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return null;
    }
    const token = parts[1];
    try {
        const { userId } = verify(token, ACCESS_TOKEN_SECRET);
        return userId;
    } catch {
        return null;
    }
};

module.exports = {
    createAccessToken,
    sendAccessToken,
    userFromToken
};
