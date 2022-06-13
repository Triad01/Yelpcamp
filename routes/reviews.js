const express = require('express')
const router = express.Router({ mergeParams: true })
const reviews = require('../controllers/review')

const Campground = require('../models/campground')
const Review = require('../models/review')
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressErrors')
//for joi server side validatin =====================


router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;