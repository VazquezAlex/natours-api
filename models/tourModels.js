const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A tour must have a name."],
        unique: true,
        trim: true
    },
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size'],
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
    },
    price: {
        type: Number,
        required: [true, "A tour must have a price."],
    },
    summary: {
        type: String,
        trim: true,
        required: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image.'],
    },
    startDates: {
        type: [Date],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    images: {
        type: [String]
    },
    description: {
        type: String,
        trim: true,
    },
    priceDiscount: {
        type: Number,
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
    },
    ratingsQuantity: {
        type: Number,
        default: 0,
    },
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
