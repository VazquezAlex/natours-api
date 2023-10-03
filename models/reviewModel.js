const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review can not be empty!'],
    },
    rating: {
        type: Number,
        required: [true, 'Rating can not be empty!'],
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'A review must belong to a tour'],
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A review must be made by a user'], 
    }
},{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Middleware to populate the user and tour.
reviewSchema.pre(/^find/, function(next) {
    this.populate({ path: 'user', select: 'name photo' });
    // Not needed any more: .populate({ path: 'tour', select: 'name' })

    next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;