// Core modules.

// Local imports.
const APIFeatures = require('./../utils/apiFeatures');
const AppError = require('../utils/appError');
const Tour = require('./../models/tourModels');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

const checkPostBody = (req, res, next) => {
    const { name, price } = req.body;

    if (!name || !price) {
        return res.status(400).json({
            status: 'failed',
            message: 'Invalid data. Please send all the required information'
        });
    }

    next();
}

const aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratings,ratingsAverage,difficulty';

    next();
}

const getAllTours = catchAsync(async (req, res, next) => {
    // Another way of filtering.
    // const tours = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy');
    
    const features =  
        new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

    const tours = await features.query;

    return res.status(200).json({
        status: 'success',
        time: req.requestTime,
        results: tours.length,
        data: { 
            tours: tours
        }
    });
})

const getTourById = catchAsync(async (req, res, next) => {

    // Get the tour by id with mongoose.
    const tour = await Tour.findById(req.params.id).populate('reviews');
    // Another way of searching: Tour.findOne({ _id: req.params.id });

    if (!tour) {
        const error = new AppError('No tour found with that ID.', 404);

        return next(error);
    }

    res.status(200).json({
        status: 'success',
        data: { 
            tour: tour
        }
    });
    
})

const createTour = factory.createOne(Tour);
const updateTour = factory.updateOne(Tour);
const deleteTour = factory.deleteOne(Tour);

const getTourStats = catchAsync(async (req, res, next) => {

    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } }
        },
        {
            $group: {
                _id: { $toUpper: '$difficulty'},
                numTours: { $sum: 1 },
                numRatings: { $sum: "$ratingsQuantity" },
                avgRating: { $avg: "$ratingsAverage" },
                avgPrice: { $avg: "$price" },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
            }
        },
        {
            $sort: { minPrice: 1 }
        },
        // {
        //     $match: { _id: { $ne: 'EASY' } }
        // }
    ]);

    res.status(200).json({
        status: 'success',
        stats: stats
    })
})

const getMonthlyPlan = catchAsync(async (req, res, next) => {

    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${ year }-01-01`),
                    $lte: new Date(`${ year }-12-31`)
                }
            }
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTourStarts: { $sum: 1 },
                tours: { $push: "$name" }
            }
        },
        {
            $addFields: { month: '$_id' }
        },
        {
            $project: {
                _id: 0
            }
        },
        {
            $sort: { month: 1 }
        },
        {
            $limit: 12
        }
    ]);

    res.status(200).json({
        status: 'success',
        plan: plan
    })
})

module.exports = {
    aliasTopTours,
    getAllTours,
    getMonthlyPlan,
    getTourById,
    getTourStats,
    createTour,
    updateTour,
    deleteTour,
    checkPostBody,
}