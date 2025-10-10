const { sign } = require('jsonwebtoken');
const cookieParser = require('cookie-parser');


const createAccessToken = userId => {
    return sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
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
