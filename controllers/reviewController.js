// Local imports.
const catchAsync = require('../utils/catchAsync');
const Review = require('./../models/reviewModel');

const getAllReviews = catchAsync(async (req, res, next) => {

    const reviews = await Review.find();

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
            reviews: reviews
        }
    });
})

const saveReview = catchAsync(async (req, res, next) => {

    const review = await Review.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            review: review
        }
    });
})

module.exports = {
    getAllReviews,
    saveReview
}