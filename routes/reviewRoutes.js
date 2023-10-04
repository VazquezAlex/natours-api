// Third party imports.
const express = require('express');

// Local imports.
const { protect, restrictTo } = require('../controllers/authController');
const { 
    getAllReviews, 
    saveReview,
    deleteReview,
    updateReview,
    setTourUserIds,
    getReview, 
} = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true });

router.route('/')
    .get(getAllReviews)
    .post(protect, restrictTo('user'), setTourUserIds, saveReview);

router.route('/:id')
    .get(getReview)
    .delete(deleteReview)
    .patch(updateReview);

module.exports = router;
