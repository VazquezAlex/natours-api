// Core imports.
const crypto = require('crypto');

// Third party imports.
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!'],
    },
    email: {
        type: String,
        required: [true, 'A User must have an email.'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'The email must by of type email']
    },
    photo: {
        type: String,
    },
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minLength: [8, 'Password must have at least 8 characters.'],
        select: false, // Don't show the password on any output.
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            // This only works on .create() and .save();
            validator: function(val) {
                return val === this.password;
            },
            message: 'The passwords need to match' 
        }
    },
    passwordChangedAt: {
        type: Date
    },
    passwordResetToken: {
        type: String,
    },
    passwordResetExpires: {
        type: Date,
    }
});

// Before saving the user, we verify if the password was updated, if so, we updated the passwrodChangedAt property.
userSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

// Middleware to hash our password, before saving the user.
userSchema.pre('save', async function(next) {
    // If the password has not being modified, we move no the next middleware.
    if (!this.isModified('password')) return next();

    // Hash the password with bcrypt, the higher the number the safer, but more costly.
    this.password = await bcrypt.hash(this.password, 12);

    // We don't want to send the confirmation to the DB, so we delete it.
    this.passwordConfirm = undefined;

    // We pass to the next middleware.
    next();
});

// Instance method to unhash the password.
userSchema.methods.correctPassword = async function(candidatesPassword, userPassword) {
    return await bcrypt.compare(candidatesPassword, userPassword);
};

// Instance method to get if the password was changed after the token was issued.
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

        return changedTimestamp > JWTTimestamp;
    }

    return false;
};

// Instance method to get a unique token for forgotten password.
userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    // We hash/encrypt the token for the user and store it on the data base field.
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // We set the expire time for 10 minutes.
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    console.log({ resetToken }, this.passwordResetToken);
    
    return resetToken;
};


const User = mongoose.model('User', userSchema);

module.exports = User;
