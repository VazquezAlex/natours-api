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
    }
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
}

const User = mongoose.model('User', userSchema);

module.exports = User;
