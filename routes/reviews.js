const express = require('express')
const router = express.Router({mergeParams: true}) //allow access to the params in the basic route in the index/app file
const Campground = require('../models/campground')
const Review = require('../models/review')
const reviewController = require('../controllers/reviews')
const catchAsync = require('../utils/catchAsync')
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware')



router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviewController.destroyReview))

router.post('/', isLoggedIn, validateReview, catchAsync(reviewController.createReview))

module.exports = router