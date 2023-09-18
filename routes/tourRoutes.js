// Third party modules.
const express = require('express');

// Local imports.
const {
    getAllTours,
    getTourById,
    createTour,
    updateTour,
    deleteTour,
    checkID
} = require('./../controllers/tourControllers');

const router = express.Router();

// Param middleware, we take an action when 'id' param is passed.
router.param('id', checkID);

router.route('/')
    .get(getAllTours)
    .post(createTour);

router.route('/:id')
    .get(getTourById)
    .patch(updateTour)
    .delete(deleteTour);

module.exports = router;
