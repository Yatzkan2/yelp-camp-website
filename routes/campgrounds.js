const express = require('express')
const multer  = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({ storage })

const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground')
const campgroundsController = require('../controllers/campgrounds')
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware')

const router = express.Router()

router.route('/')
    .get(catchAsync(campgroundsController.index))
    //.post(isLoggedIn, validateCampground, catchAsync(campgroundsController.createCampground))
    .post(upload.array('image'), (req, res) => {
        console.log(req.body, req.files)
        res.send('temp')
    })

router.get('/new', isLoggedIn, campgroundsController.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgroundsController.showCampground))
    .put(isLoggedIn, isAuthor, catchAsync(campgroundsController.editCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgroundsController.destroyCampground))

    router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgroundsController.renderEditForm))

module.exports = router