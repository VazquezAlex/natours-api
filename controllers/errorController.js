
const sendErrorDev = (error, res) => {
    res.status(error.statusCode).json({
        status: error.status,
        error: error,
        message: error.message,
        stack: error.stack
    });
}

const sendErrorProd = (error, res) => {
    // Operation trusted error, we send the message.
    if (error.isOperational) {
        res.status(error.statusCode).json({
            status: error.status,
            message: error.message,
        });

    // Unknown error, we don't want to leak the details to the client.
    } else {
        // Log the error for the developers.
        console.log('ERROR 💥' + error);

        // We send the client a generic messsage.
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!'
        })
    }
}

const appErrorController = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(error, res);
    }
    if (process.env.NODE_ENV === 'production') {
        sendErrorProd(error, res);
    }

}

module.exports = appErrorController;
