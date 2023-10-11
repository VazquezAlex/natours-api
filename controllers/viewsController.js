// Local imports.
const catchAsync = require('../utils/catchAsync');
const Tour = require('./../models/tourModels');

const getOverview = catchAsync(async (req, res, next) => {

    // 1) Get tour data from collection.
    const tours = await Tour.find();

    // 2) Build template

    // 3) Render the template using tour data from 1).

    res.status(200).render('overview', {
        title: 'All Tours',
        tours
    });
});

const getTour = (req, res) => {
    res.status(200).render('tour', {
        title: 'The Forest Hiker Tour'
    });
}

module.exports = {
    getOverview,
    getTour
}