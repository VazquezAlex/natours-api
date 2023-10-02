// Third party modules.
const express = require('express');

// Local imports.
const {
    createUser,
    deleteUser,
    getAllUsers,
    getUser,
    updateUser,
} = require('./../controllers/userController');

const {
    forgotPassword,
    login,
    resetPassword, 
    signUp,
    protect,
    updatePassword,
} = require('./../controllers/authController');

const router = express.Router();

// Auth routes 👇🏻.
router.post('/signup', signUp);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updateMyPassword', protect, updatePassword);

// User routes 👇🏻.
router.route('/')
    .get(getAllUsers)
    .post(createUser);

router.route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);

module.exports = router;