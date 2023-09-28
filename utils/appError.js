
class AppError extends Error {

    constructor(message, statusCode) {
        // We call the super for the extended class.
        super(message);

        this.statusCode = statusCode;
        this.status = `${ statusCode }`.startsWith('4') ? 'failed' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;