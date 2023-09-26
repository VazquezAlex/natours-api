// Third party modules.
const express = require('express');

// Local imports.
const {
    getAllTours,
    getTourById,
    createTour,
    updateTour,
    deleteTour,
    checkPostBody
} = require('./../controllers/tourControllers');

const router = express.Router();

// Param middleware, we take an action when 'id' param is passed.
// router.param('id', checkID);

// Create a checkbody middleware
// Check if body contains name and price property.
// If not, send back 400 (bad request).
// Add it to the post handler stack.

router.route('/')
    .get(getAllTours)
    .post(checkPostBody, createTour);

router.route('/:id')
    .get(getTourById)
    .patch(updateTour)
    .delete(deleteTour);

module.exports = router;
