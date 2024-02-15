const passport = require('passport')
const Campground = require('./models/campground')
const Review = require('./models/review')
const {campgroundSchema, reviewSchema} = require('./schemas') //Joi schemas for validation
const ExpressError = require('./utils/ExpressError')

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()){
        const {id=''} = req.params
        //console.log(`method: ${req.method}`)
        req.session.returnTo = (req.method !== 'GET') ? `/campgrounds/${id}` : req.originalUrl //non GET request shall be ridrected to the camp's show page
        req.flash('error', 'You are not logged in')
        res.redirect('/login')
    } else {
        //console.log(req.method)
        next()
    }
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const {id} = req.params
    const camp = await Campground.findById(id)
    if (!camp.author.equals(req.user._id)) {
        req.flash('error', 'You dont have permission to do that!')
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const {id, reviewId} = req.params
    const review = await Review.findById(reviewId)
    if(!review.author.equals(req.user._id)) {
        req.flash('error', 'You dont have permoission to do that!')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports.validateCampground = (req, res, next) => {
    console.log('INSIDE VALIDATION MIDDLWARE')
    const {error, value} = campgroundSchema.validate(req.body)

    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

module.exports.validateReview = (req, res, next) => {
    const {error, value} = reviewSchema.validate(req.body)

    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}