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

// Need user to be logged in, to access this routes.
router.use(protect);

router.route('/')
    .get(getAllReviews)
    .post(restrictTo('user'), setTourUserIds, saveReview);

router.route('/:id')
    .get(getReview)
    .delete(restrictTo('user', 'admin'), deleteReview)
    .patch(restrictTo('user', 'admin'), updateReview);

module.exports = router;
