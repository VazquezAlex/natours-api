// Third party modules.
const express = require('express');

// Local imports.
const {
    createUser,
    deleteUser,
    getAllUsers,
    getUser,
    updateMe,
    updateUser,
    deleteMe,
    getMe,
} = require('./../controllers/userController');

const {
    forgotPassword,
    login,
    resetPassword, 
    signUp,
    protect,
    updatePassword,
    restrictTo,
} = require('./../controllers/authController');

const router = express.Router();

// Auth routes 👇🏻.
router.post('/signup', signUp);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', protect, resetPassword);

router.use(protect);

router.patch('/updateMyPassword', updatePassword);

// User routes 👇🏻.
router.get('/me', getMe, getUser);
router.patch('/updateMe', updateMe);
router.delete('/deleteMe', deleteMe);

// Restrict getting all the info for admins.
router.use(restrictTo('admin'));

router.route('/')
    .get(getAllUsers)
    .post(createUser);

router.route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);

module.exports = router;