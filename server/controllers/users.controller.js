
const getUsers = (req, res) => {
    res.send('Hello from getUsers');
};

const getUser = (req, res) => {
    res.send('Hello from getUser');
};

const createUser = (req, res) => {
    res.send('Hello from createUser');
};

const updateUser = (req, res) => {
    res.send('Hello from updateUser');
};

const deleteUser = (req, res) => {
    res.send('Hello from deleteUser');
};

module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
};
