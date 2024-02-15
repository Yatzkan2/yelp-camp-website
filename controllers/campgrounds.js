const Campground = require('../models/campground')

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds})
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.showCampground = async (req, res) => {
    const {id} = req.params
    const camp = await Campground.findById(id).populate({
        path: 'reviews', 
        populate: {
            path: 'author'
        }
    }).populate('author')

    if(!camp) {
        req.flash('error', 'Cannot find campground')
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/show',{camp})
}

module.exports.createCampground = async (req, res, next) => {
    const camp = new Campground(req.body.campground)
    camp.author = req.user._id
    await camp.save()
    req.flash('success', 'New campground successfully created')
    res.redirect(`/campgrounds/${camp._id}`)
}

module.exports.renderEditForm = async (req, res) => {
    const {id} = req.params
    const camp = await Campground.findById(id)
    if(!camp) {
        req.flash('error', 'Cannot find campground')
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', {camp})
}

module.exports.editCampground = async (req, res) => {
    const {id} = req.params
    const camp = await Campground.findByIdAndUpdate(id, req.body.campground)
    req.flash('success', 'Campground successfully updated')
    res.redirect(`/campgrounds/${id}`)
}

module.exports.destroyCampground = async (req, res) => {
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Campground successfully deleted')
    res.redirect('/campgrounds')
}