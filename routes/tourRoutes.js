// Third party modules.
const express = require('express');

// Local imports.
const {
    getAllTours,
    getTourById,
    createTour,
    updateTour,
    deleteTour
} = require('./../controllers/tourControllers');

const router = express.Router();

router.route('/')
    .get(getAllTours)
    .post(createTour);

router.route('/:id')
    .get(getTourById)
    .patch(updateTour)
    .delete(deleteTour);

module.exports = router;
