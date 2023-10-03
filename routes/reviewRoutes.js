// Third party imports.
const express = require('express');

// Local imports.
const { protect, restrictTo } = require('../controllers/authController');
const { 
    getAllReviews, 
    saveReview,
    deleteReview, 
} = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true });

router.route('/')
    .get(getAllReviews)
    .post(protect, restrictTo('user'), saveReview);

router.route('/:id')
    .delete(deleteReview);

module.exports = router;
