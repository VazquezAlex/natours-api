// Third party modules.
const express = require('express');
const morgan = require('morgan');

// Local import modules.
const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const globalErrorHandler = require('./controllers/errorController');

// Create the app.
const app = express();

// Middlewares 👇🏻.

// Third party middleware.
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Middleware to use json from body objects.
app.use(express.json());

// Middle to serve static files.
app.use(express.static(`${ __dirname }/public`));

// Updating the request object on our own middleware.
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// Routes 👇🏻
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Handled the not found routes.
app.all('*', (req, res, next) => {
    const error = new AppError(`Can't find ${ req.originalUrl } on this server.`, 404);

    next(error);
});

// Error handling middleware.
app.use(globalErrorHandler);

module.exports = app