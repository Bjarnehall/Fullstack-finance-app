const User = require('../models/user.model.js');
const { hash, compare } = require('bcryptjs');
const { createAccessToken, sendAccessToken, userFromToken } = require('../models/token.model.js');
/* const { ACCESS_TOKEN_SECRET } = require('../../keys.js'); */
/*
Searches for users in database collection User
return result as json and status code
*/
const getUsers = async (req, res) => {
    try {
        const user = await User.find({});
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};
/*
Searches for single user in database collection User
takes user id from url and return result as json and status code
*/
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

const userValid = async (req, res) => {
    try {
        const userId = userFromToken(req);
        if (!userId) {
            return res.status(400).json({ valid: false, message: "You need to log in" });
        }

        return res.status(200).json({ valid: true, userId });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ valid: false });
    }
};


module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    loginUser,
    userValid
};
