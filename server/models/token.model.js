const { sign } = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { ACCESS_TOKEN_SECRET } = require('../keys.js');

const createAccessToken = userId => {
    return sign({ userId }, ACCESS_TOKEN_SECRET, {
        expiresIn: '15m',
    })
};

const sendAccessToken = (res,req, accesstoken) => {
    res.send ({
        accesstoken,
        email: req.body.email,
    })
};

module.exports = {
    createAccessToken,
    sendAccessToken,
};
