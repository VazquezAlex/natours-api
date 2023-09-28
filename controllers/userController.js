const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');

const getAllUsers = catchAsync(async (req, res) => {

    const users = await User.find();

    res.status(500).json({
        status: 'success',
        data: {
            users
        }
    });
})

const createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined.'
    });
}

const getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined.'
    });
}

const updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined.'
    });
}

const deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined.'
    });
}

module.exports = {
    getAllUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser
}