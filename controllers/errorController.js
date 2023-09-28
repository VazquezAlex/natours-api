// Local imports.
const AppError = require("../utils/appError");

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
}

const sendErrorProd = (err, res) => {
    // Operation trusted error, we send the message.
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });

    // Unknown error, we don't want to leak the details to the client.
    } else {
        // Log the error for the developers.
        console.log('ERROR 💥' + err);

        // We send the client a generic messsage.
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!'
        })
    }
}

const handleCastErrorDB = (err) => {
    const message = `Invalid ${ err.path }: ${ err.value }`;

    
    return new AppError(message, 400);
}

const handleDuplicateFieldsDB = (err) => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate filed value: ${ value }. Please use another value.`;

    return new AppError(message, 400);
}

const appErrorController = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    }
    if (process.env.NODE_ENV === 'production') {
        let error = Object.assign(err);
        
        if (err.name === 'CastError') error = handleCastErrorDB(error);
        if (err.code === 11000) error = handleDuplicateFieldsDB(error);

        sendErrorProd(error, res);
    }

}

module.exports = appErrorController;
