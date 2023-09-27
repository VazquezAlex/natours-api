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
        // Another way of filtering.
        // const tours = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy');
        
        // 1.1) Simple filtering.
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        // 1.2) Advanced filtering.
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${ match }`);

        // Call all the tours with mongoose.
        let query = Tour.find(JSON.parse(queryStr));

        // 2) Sorting.
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            // query = query.sort(req.query.sort);
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt _id');
        }

        // 3) Field limiting.
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else {
            query = query.select('-__v');
        }

        // 4) Pagination.
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);

        if (req.query.page) {
            const numTours = await Tour.countDocuments();
            if (skip >= numTours) throw new Error('This page does not exist');
        }
           
        const tours = await query;

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
            message: 'Failed getting the data ' + err + '.'
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