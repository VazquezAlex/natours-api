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
const { protect } = require('../controllers/authController');

const router = express.Router();

// Param middleware, we take an action when 'id' param is passed.
// router.param('id', checkID);

// Create a checkbody middleware
// Check if body contains name and price property.
// If not, send back 400 (bad request).
// Add it to the post handler stack.

router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);

router.route('/top-5-tours')
    .get(aliasTopTours, getAllTours)

    router.route('/')
    .get(protect, getAllTours)
    .post(checkPostBody, createTour);

router.route('/:id')
    .get(getTourById)
    .patch(updateTour)
    .delete(deleteTour);

module.exports = router;
