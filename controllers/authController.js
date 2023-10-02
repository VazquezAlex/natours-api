// Core import.
const { promisify } = require('util');
const crypto = require('crypto');

// Third party imports.
const jwt = require('jsonwebtoken');

// Local imports.
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');
const sendEmail = require('../utils/email');

const signToken = (id) => jwt.sign(
    { id },     // Payload.
    process.env.JWT_SECRET,  // Secret.
    { expiresIn: process.env.JWT_EXPIRES_IN } // Expire time.       
);

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user,
        }
    });
}

const signUp = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt,
        role: req.body.role
    });

    createSendToken(newUser._id, 201, res);
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
    createSendToken(user, 200, res);
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

const forgotPassword = catchAsync(async (req, res, next) => {

    // 1) Get user based on posted email.
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(new AppError('There is no user with that email address', 404));

    // 2) Genarate the random token.
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) Send the user as email.
    const resetUrl = `${ req.protocol }://${ req.get('host') }/api/v1/users/resetPassword/${ resetToken }`;

    const message = `
        Forgot your password? Submit a PATCH request with you new password and passwordConfir to: ${ resetUrl }. 
        \nIf you didn't forget your password, please ignore this email.
    `;
    
    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 minutes)',
            message
        });
    
        res.status(200).json({
            status: 'success',
            message: 'Token sent to the email'
        });
    } catch (e) {
        user.passwordResetToken = undefined;
        user.passwordResetExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new AppError('There was an error sending the email. Try again later.', 500));
    }
})

const resetPassword = catchAsync(async (req, res, next) => {

    // 1) Get user based on the token.
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ 
        passwordResetToken: hashedToken, 
        passwordResetExpires: { $gt: Date.now() } 
    });

    // 2) If token has not expired and there is a user, set the new password.
    if (!user) {
        return next(new AppError('Token is invalid or has expired.', 400));
    }

    // 3) Update the changedPasswordAt property.
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 4) Log the user in, send the JWT.
    createSendToken(user, 200, res);
});

const updatePassword = catchAsync(async (req, res, next) => {

    // 1) Get the user from collection.
    const user = await User.findById(req.user.id).select('+password');

    // 2) Check if the current password is correct.
    const isPasswordCorrect = await user.correctPassword(req.body.passwordCurrent, user.password)
    if (!isPasswordCorrect) {
        return next(new AppError('Your current password is wrong.', 401));
    }

    // 3) Update the password.
    user.password = req.body.password;
    user.passwordConfirm = req.body.password;
    await user.save();

    // 4) Log the user in, and send the JWT.
    createSendToken(user, 200, res);
})

module.exports = {
    forgotPassword,
    login,
    protect,
    resetPassword,
    restrictTo,
    signUp,
    updatePassword,
}