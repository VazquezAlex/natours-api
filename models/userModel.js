const mongoose = require('mongoose');
const validator = require('validator');

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
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function(val) {
                return val === this.password;
            },
            message: 'The passwords need to match' 
        }
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
