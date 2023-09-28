// Third party imports.
const jwt = require('jsonwebtoken');

// Local imports.
const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');

const signUp = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });

    const token = jwt.sign(
        { id: newUser._id },     // Payload.
        process.env.JWT_SECRET,  // Secret.
        { expiresIn: process.env.JWT_EXPIRES_IN } // Expire time.       
    )

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser,
        }
    });
});

module.exports = {
    signUp,
}