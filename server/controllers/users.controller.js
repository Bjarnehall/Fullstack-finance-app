const User = require('../models/user.model.js');
const { hash, compare } = require('bcryptjs');
const { createAccessToken, createRefreshToken, sendAccessToken, sendRefreshToken, } = require('../models/token.model.js');


const getUsers = async (req, res) => {
    try {
        const user = await User.find({});
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const createUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        findUser = await User.findOne({ email });
        if (findUser) {
            return res.status(400).json({ message: "Email is already used" });
        }

        const hashedPassword = await hash(password, 10);
        const newUser = new User ({
            email,
            password: hashedPassword,
        });
        await newUser.save();
        res.status(200).json({ message: "User registered" });

/*         const user = await User.create(req.body);
        res.status(200).json(user); */
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const updateUser = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findByIdAndUpdate(id, req.body);

        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        const updatedUser = await User.findById(id);
        res.status(200).json(updatedUser);
    } catch {
        res.status(500).json({message: error.message});
    }
};

const deleteUser = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findByIdAndDelete(id, req.body);

        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        res.status(200).json({message: "User deleted"});
    } catch {
        res.status(500).json({message: error.message});
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try{
        const findUser = await User.findOne ({ email });
        if (!findUser) {
            return res.status(400).json({ message: "User could not been found with that emai" });
        }
        const valid = await compare(password, findUser.password);
        if (!valid) {
            return res.status(400).json({ message: "Password is incorrect" });
        }
        // Create accesstoken and refreshtoken
        const accesstoken = createAccessToken(findUser._id);
        const refreshtoken = createRefreshToken(findUser._id);
        // Put the refreshtoken in the database
        findUser.refreshToken = refreshtoken;
        await findUser.save();
        console.log(refreshtoken);
        // Send Refresh token as coockie and token as return
        sendRefreshToken(res, refreshtoken);
        sendAccessToken(res, req, accesstoken);

    } catch(err) {
        res.send({ error: `${err.message}` });
    }

}

module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    loginUser
};
