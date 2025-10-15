const express = require('express');
const router = express.Router();
const {getUsers, getUser, createUser, updateUser, deleteUser, loginUser, userValid} = require('../controllers/users.controller.js');
/*
Routes for handling events regarding users
*/
router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/register', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.post('/login', loginUser);
router.post('/validate', userValid);

module.exports = router;
