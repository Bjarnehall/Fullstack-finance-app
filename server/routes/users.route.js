const express = require('express');
const router = express.Router();
const {getUsers, getUser, createUser, updateUser, deleteUser, loginUser} = require('../controllers/users.controller.js');

router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.post('/login', loginUser);

module.exports = router;