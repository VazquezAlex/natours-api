// Third party imports.
const express = require('express');

// Local imports.
const { protect, restrictTo } = require('../controllers/authController');
const { 
    getAllReviews, 
    saveReview, 
} = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true });

router.route('/')
    .get(getAllReviews)
    .post(protect, restrictTo('user'), saveReview)

module.exports = router;
