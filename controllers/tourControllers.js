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

const getAllTours = async (req, res) => {
    
    try {
        // Call all the tours with mongoose.
        const tours = await Tour.find();
    
        res.status(200).json({
            status: 'success',
            time: req.requestTime,
            results: tours.length,
            data: { 
                tours: tours
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: 'Failed getting the data.'
        })
    }

}

const getTourById = async (req, res) => {

    try {
        // Get the tour by id with mongoose.
        const tour = await Tour.findById(req.params.id);
        // Tour.findOne({ _id: req.params.id });
    
        res.status(200).json({
            status: 'success',
            data: { 
                tour: tour
            }
        });

    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: 'Failed getting the data.'
        })
    }
    
}

const createTour = async (req, res) => {

    try {
        // Create the new doc with mongoose model.
        const newTour = await Tour.create(req.body);
    
        res.status(201).json({
            status: "success",
            data: {
                tour: newTour
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: 'Invalid data sent! ' + err
        });
    }
}

const updateTour = async (req, res) => {
    
    try {
        const tour = await Tour.findByIdAndUpdate(
            req.params.id, // ID we are updating.
            req.body,      // Data passed from the body.
            {
                new: true, // Returns the new document here.
                runValidators: true,
            }
        )
        
        res.status(200).json({
            status: 'success',
            data: {
                tour: tour
            }
        })

    } catch (e) {
        res.status(400).json({
            status: 'failed',
            message: "Failed updating"
        })
    }

}

const deleteTour = async (req, res) => {

    try {

        await Tour.findByIdAndDelete(req.params.id); 
        
        res.status(204).json({
            status: 'success',
            data: null
        })
    } catch (e) {
        res.status(400).json({
            status: 'failed',
            message: "Failed deleting"
        })
    }

}

module.exports = {
    getAllTours,
    getTourById,
    createTour,
    updateTour,
    deleteTour,
    checkPostBody,
}