const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../models/user')
const usersContoroller = require('../controllers/users')
const catchAsync = require('../utils/catchAsync')
const {storeReturnTo} = require('../middleware')

router.route('/register')
    .get(usersContoroller.renderRegister)
    .post(catchAsync(usersContoroller.register))

router.route('/login')
    .get(usersContoroller.renderLogin)
    .post(storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), catchAsync(usersContoroller.login))

router.get('/logout', usersContoroller.logout);

module.exports = router