const User = require('../models/user.model.js');
const { hash, compare } = require('bcryptjs');
const { createAccessToken, sendAccessToken } = require('../models/token.model.js');


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
            return res.status(404).json();
        }
        const valid = await compare(password, findUser.password);
        if (!valid) {
            return res.status(401).json();
        }

        const accesstoken = createAccessToken(findUser._id);
        await findUser.save();
        sendAccessToken(res.status(200), req, accesstoken);

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
