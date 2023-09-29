// Core import.
const { promisify } = require('util');

// Third party imports.
const jwt = require('jsonwebtoken');

// Local imports.
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');

const signToken = (id) => jwt.sign(
    { id },     // Payload.
    process.env.JWT_SECRET,  // Secret.
    { expiresIn: process.env.JWT_EXPIRES_IN } // Expire time.       
);

const signUp = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt,
        role: req.body.role
    });

    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser,
        }
    });
});

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1) Check if email and password exist.
    if (!email || !password) {
        const error = new AppError('Please provide email and password.', 400);

        return next(error);
    }

    // 2) Check if user exists && password is correct.
    const user = await User.findOne({ email }).select('+password'); // Find and include password.

    if (!user || !await user.correctPassword(password, user.password)) {
        return next(new AppError('Incorrect email or password', 401));
    }

    // 3) If everything is ok, send token to the client.
    const token = signToken(user._id);

    res.status(200).json({
        status: 'sucess',
        token,
    })
});

const protect = catchAsync(async (req, res, next) => {
    // 1) Getting token and check if it exists.
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    
    // 1.1) Check if the token is coming on the headers.
    if (!token) {
        return next(new AppError('You are not logged in, please log in to get access.', 401));
    }

    // 2) Verification of the token.
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) If passed, we check if the user exists.
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError('This user does not exist, please log in with a valid user to get access.', 401));
    }

    // 4) Check if the user changed password after the token was issued.
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed the password! Please log in again.', 401));
    }

    // 5) Grant access to protected route.
    req.user = currentUser;
    next();
});

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action.', 403));
        }

        next();
    }
};

module.exports = {
    login,
    protect,
    restrictTo,
    signUp,
}