// Core modules.
const path = require('path');

// Third party modules.
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

// Local import modules.
const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const globalErrorHandler = require('./controllers/errorController');

// Create the app.
const app = express();

// Use pug for server side rendering.
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middle to serve static files.
app.use(express.static(path.join(__dirname, 'public')));

// Middlewares 👇🏻.

// Third party middleware.
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Set security HTTP headers.
app.use(helmet());

// Limit the amount of calls from the same IP.
const limiter = rateLimit({
    max: 100,                  // Number of request from the same IP, adapt to each application.
    windowMs: 60 * 60 * 1000,  // In which window of time in milliseconds (1 hours here).
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Middleware to use json from body objects.
app.use(express.json({ limit: '10kb' }));

// Data sanitization againt NoSQL query injection.
app.use(mongoSanitize());

// Data sanitization againt XSS (cross site attacks).
app.use(xss());

// Prevent parameter polution.
app.use(
    hpp({
        whitelist: [
            'duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price'
        ]
    })
);

// Updating the request object on our own middleware.
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// Leaflet map config.
// Further HELMET configuration for Security Policy (CSP)
const scriptSrcUrls = ['https://unpkg.com/',
    'https://tile.openstreetmap.org'];
const styleSrcUrls = [
    'https://unpkg.com/',
    'https://tile.openstreetmap.org',
    'https://fonts.googleapis.com/'
];
const connectSrcUrls = ['https://unpkg.com', 'https://tile.openstreetmap.org'];
const fontSrcUrls = ['fonts.googleapis.com', 'fonts.gstatic.com'];
 
//set security http headers
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", 'blob:'],
            objectSrc: [],
            imgSrc: ["'self'", 'blob:', 'data:', 'https:'],
            fontSrc: ["'self'", ...fontSrcUrls]
        }
    })
);

// Routes 👇🏻

// Server side rendering routes.
app.use('/', viewRouter);

// API routes.
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// Handled the not found routes.
app.all('*', (req, res, next) => {
    const error = new AppError(`Can't find ${ req.originalUrl } on this server.`, 404);

    next(error);
});

// Error handling middleware.
app.use(globalErrorHandler);

module.exports = app