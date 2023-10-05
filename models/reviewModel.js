const mongoose = require('mongoose');
const Tour = require('./tourModels');

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

// Each combination of tour and user has to be unique.
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// Middleware to populate the user and tour.
reviewSchema.pre(/^find/, function(next) {
    this.populate({ path: 'user', select: 'name photo' });
    // Not needed any more: .populate({ path: 'tour', select: 'name' })

    next();
});

// Function to calculate the average ratings of a tour.
reviewSchema.statics.calcAverageRatings = async function(tourId) {
    // Here, 'this' equals to the current model.
    const stats = await this.aggregate([
        {
            $match: { tour: tourId }
        },
        {
            $group: {
                _id: '$tour',
                nRating: { $sum: 1 },
                avgRating: {$avg: '$rating' }
            }
        }
    ]);

    if (stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsAverage: stats[0].avgRating,
            ratingsQuantity: stats[0].nRating,
        });
    } else {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsAverage: 0,
            ratingsQuantity: 0,
        });
    }

};

// Middleware to calcular the ratings average, after saving a new review for a tour.
reviewSchema.post('save', function() {
    // 'this' points to current review.
    this.constructor.calcAverageRatings(this.tour);

});

reviewSchema.pre(/^findOneAnd/, async function(next) {
    this.r = await this.findOne();

    next();
});

reviewSchema.post(/^findOneAnd/, async function() {
    await this.r.constructor.calcAverageRatings(this.r.tour);
});



const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
