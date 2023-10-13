// Local imports.
const catchAsync = require('../utils/catchAsync');
const Tour = require('./../models/tourModels');

const getOverview = catchAsync(async (req, res, next) => {

    // Get tour data from collection.
    const tours = await Tour.find();

    res.status(200).render('overview', {
        title: 'All Tours',
        tours
    });
});

const getTour = catchAsync( async (req, res) => {

    // Get the data for the requested tour, including reviews and guides.
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        fields: 'review rating user'
    });

    res.status(200).render('tour', {
        title: `${ tour.name } Tour`,
        tour
    });
});

const getLoginForm = (req, res) => {

    res.status(200).render('login', {
        title: 'Log into your account'
    });
}

module.exports = {
    getLoginForm,
    getOverview,
    getTour
}