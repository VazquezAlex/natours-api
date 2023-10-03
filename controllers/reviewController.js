// Local imports.
const catchAsync = require('../utils/catchAsync');
const Review = require('./../models/reviewModel');
const factory = require('./handlerFactory');

const getAllReviews = catchAsync(async (req, res, next) => {

    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const reviews = await Review.find(filter);

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
            reviews: reviews
        }
    });
})

const saveReview = catchAsync(async (req, res, next) => {

    // Allow nested routes.
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;

    const review = await Review.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            review: review
        }
    });
})

const deleteReview = factory.deleteOne(Review);

module.exports = {
    deleteReview,
    getAllReviews,
    saveReview
}