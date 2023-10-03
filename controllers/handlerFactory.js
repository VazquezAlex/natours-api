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
})

module.exports = {
    deleteOne,
}