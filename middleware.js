
const { campgroundSchema, reviewSchema } = require('./schemas')
const ExpressError = require('./utils/ExpressErrors')
const Campground = require('./models/campground')
const Review = require('./models/review')


// middleware to check if youre athenticated(registered), i.e checks if there is a currentUser authenticated in that session
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'you must be signed in first')
        return res.redirect('/login')
    }
    next()
}


//to verify current author of campground
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'you do not have permission to do that')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

// to verify current author of review
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId)
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'you do not have permission to do that')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

//middleware to validate reviews(joi)(recall; to validate data from req.body)
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

// using JOI for server side validation against invalid inputs from postman =================

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}
