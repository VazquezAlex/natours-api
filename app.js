// Third party modules.
const express = require('express');
const morgan = require('morgan');

// Local import modules.
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

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
    res.status(404).json({
        status: 'failed',
        message: `Can't find ${ req.originalUrl } on this server.`
    });
});

module.exports = app