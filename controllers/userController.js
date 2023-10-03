const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');
const factory = require('./handlerFactory');

const filterBody = (body, ...allowedFields) => {
    const filteredBody = {};
    Object.keys(body).forEach(el => {
        if (allowedFields.includes(el)) filteredBody[el] = body[el];
    })

    return filteredBody;
}

const getAllUsers = catchAsync(async (req, res) => {

    const users = await User.find();

    res.status(200).json({
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

// Update the currently signed user.
const updateMe = catchAsync(async (req, res, next) => {

    // 1) Create error if user POSTs the password data.
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password updates, please user updateMyPassword.', 400));
    }

    // 2) Update user document.
    const filteredBody = filterBody(req.body, 'name', 'email');
    const updatedUser = await User.findOneAndUpdate(
        req.user.id,   // Id to search for.
        filteredBody,  // New properties to update.
        { // Options
            new: true,           // Return the updated user.
            runValidators: true  // Validate the schema.
        }
    );

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});

const deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(
        req.user.id,       // Id to update.
        { active: false }  // Data to update.
    );

    res.status(204).json({
        status: 'success',
        data: null,
    })

});

// Update any user.
const updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined.'
    });
}

const deleteUser = factory.deleteOne(User);

module.exports = {
    createUser,
    deleteMe,
    deleteUser,
    getAllUsers,
    getUser,
    updateMe,
    updateUser,
}