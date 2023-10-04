// Local imports.
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const deleteOne = Model => catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id); 

    if (!document) {
        const error = new AppError('No document found with that ID.', 404);

        return next(error);
    }
    
    res.status(204).json({
        status: 'success',
        data: null
    });
});

const updateOne = Model => catchAsync(async (req, res, next) => {
    
    const doc = await Model.findByIdAndUpdate(
        req.params.id, // ID we are updating.
        req.body,      // Data passed from the body.
        {
            new: true, // Returns the new document here.
            runValidators: true,
        }
    )

    if (!doc) {
        const error = new AppError('No document found with that ID.', 404);

        return next(error);
    }
    
    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        }
    })
})

const createOne = Model => catchAsync(async (req, res, next) => {
    // Create the new doc with mongoose model.
    const doc = await Model.create(req.body);

    res.status(201).json({
        status: "success",
        data: {
            data: doc
        }
    });
});

const getOne = (Model, populateOptions) => catchAsync(async (req, res, next) => {
    // Get the tour by id with mongoose.
    let query = Model.findById(req.params.id);
    
    if (populateOptions) query = query.populate(populateOptions);
    const doc = await query;

    if (!doc) {
        const error = new AppError('No document found with that ID.', 404);

        return next(error);
    }

    res.status(200).json({
        status: 'success',
        data: { 
            doc: doc
        }
    });
});

const getAll = (Model) => catchAsync(async (req, res, next) => {

    // To allow for nested GET reviews on tour.
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    
    const features =  
        new APIFeatures(Model.find(filter), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

    const docs = await features.query;

    return res.status(200).json({
        status: 'success',
        time: req.requestTime,
        results: docs.length,
        data: { 
            data: docs
        }
    });
})

module.exports = {
    createOne,
    deleteOne,
    getAll,
    getOne,
    updateOne,
}