// Third party modules.
const express = require('express');

// Local imports.
const {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
} = require('./../controllers/userController');

const {
    signUp
} = require('./../controllers/authController');

const router = express.Router();

// Auth routes 👇🏻.
router.post('/signup', signUp);


// User routes 👇🏻.
router.route('/')
    .get(getAllUsers)
    .post(createUser);

router.route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);

module.exports = router;