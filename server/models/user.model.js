const mongoose = require('mongoose');

const UserSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "Please enter email"],
        },
        password: {
            type: String,
            required: [true, "Please enter password"],
        },
        refreshToken: {
            type: String,
            default: "",
        },
    },
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
