// Third party modules.
const express = require('express');

// Local imports.
const {
    aliasTopTours,
    getAllTours,
    getMonthlyPlan,
    getTourById,
    getTourStats,
    createTour,
    updateTour,
    deleteTour,
    checkPostBody,
} = require('./../controllers/tourControllers');
const { protect, restrictTo } = require('../controllers/authController');
const reviewRouter = require('./../routes/reviewRoutes'); 

const router = express.Router();

// Param middleware, we take an action when 'id' param is passed.
// router.param('id', checkID);

// Create a checkbody middleware
// Check if body contains name and price property.
// If not, send back 400 (bad request).
// Add it to the post handler stack.

router.use('/:tourId/reviews', reviewRouter);

router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year')
    .get(protect, restrictTo('admin', 'guide', 'lead-guide'), getMonthlyPlan);

router.route('/top-5-tours')
    .get(aliasTopTours, getAllTours)

router.route('/')
    .get(getAllTours)
    .post(protect, restrictTo('admin', 'lead-guide'), checkPostBody, createTour);

router.route('/:id')
    .get(getTourById)
    .patch(protect, restrictTo('admin', 'lead-guide'), updateTour)
    .delete(
        protect,                       // We protect the route from un-signed users.
        restrictTo('admin', 'lead-guide'),  // We verify the user has access to this action.
        deleteTour                     // We execute the action on the route.
    );

module.exports = router;
