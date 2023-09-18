// Core modules.
const fs = require('fs');

// Extract the data for the tours.
const tours = JSON.parse(fs.readFileSync(`${ __dirname }/../dev-data/data/tours-simple.json`));

const checkID = (req, res, next, val) => {
    const tour = tours.find(tour => tour.id === val * 1);

    if (!tour) {
        return res.status(404).json({
            status: 'failed',
            message: 'Invalid ID. We could not find this tour.'
        });
    }

    next();
}

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
        results: tours.length,
        data: { 
            tours: tours
        }
    });
}

const getTourById = (req, res) => {
    const id = req.params.id * 1; // We convert it to number.
    const tour = tours.find(tour => tour.id === id);

    res.status(200).json({
        status: 'success',
        data: { 
            tour: tour
        }
    });
}

const createTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body );

    tours.push(newTour);

    fs.writeFile(`${ __dirname }/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
        res.status(201).json({
            status: "success",
            data: {
                tour: newTour
            }
        });
    });
}

const updateTour = (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find(tour => tour.id === id);

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
    checkID,
    checkPostBody,
}