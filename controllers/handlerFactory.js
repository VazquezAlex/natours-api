// Local imports.
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
})

module.exports = {
    createOne,
    deleteOne,
    updateOne,
}