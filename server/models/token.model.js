const { sign } = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const createAccessToken = userId => {
    return sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '15m',
    })
};

const createRefreshToken = userId => {
    return sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '7d',
    })
};

const sendAccessToken = (res,req, accesstoken) => {
    res.send ({
        accesstoken,
        email: req.body.email,
    })
};

const sendRefreshToken = (res, refreshtoken) => {
    res.cookie('refresh_token', refreshtoken, {
        httpOnly: true,
        path: '/',
    })
}

module.exports = {
    createAccessToken,
    createRefreshToken,
    sendAccessToken,
    sendRefreshToken,
};