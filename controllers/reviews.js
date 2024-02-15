const Review = require('../models/review')
const Campground = require('../models/campground')

module.exports.destroyReview = async (req, res) => {
    const {id, reviewId} = req.params
    //res.send(`${id}, ${reviewId}`)
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Review successfully deleted')
    res.redirect(`/campgrounds/${id}`)
}

module.exports.createReview = async (req, res) => {
    const camp = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    camp.reviews.push(review)
    await camp.save()
    await review.save()
    req.flash('success', 'New review successfully posted')
    res.redirect(`/campgrounds/${camp._id}`)
}