// Core modules.

// Local imports.
const Tour = require('./../models/tourModels');

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

const getAllTours = (req, res) => {
    console.log(req.requestTime);
    res.status(200).json({
        status: 'success',
        time: req.requestTime,
        // results: tours.length,
        // data: { 
        //     tours: tours
        // }
    });
}

const getTourById = (req, res) => {
    const id = req.params.id * 1; // We convert it to number.
    // const tour = tours.find(tour => tour.id === id);

    res.status(200).json({
        status: 'success',
        // data: { 
        //     tour: tour
        // }
    });
}

const createTour = (req, res) => {
    res.status(201).json({
        status: "success",
        // data: {
        //     tour: newTour
        // }
    });
}

const updateTour = (req, res) => {
    const id = req.params.id * 1;

    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour here>'
        }
    })
}

const deleteTour = (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find(tour => tour.id === id);

    res.status(204).json({
        status: 'success',
        data: null
    })
}

module.exports = {
    getAllTours,
    getTourById,
    createTour,
    updateTour,
    deleteTour,
    checkPostBody,
}