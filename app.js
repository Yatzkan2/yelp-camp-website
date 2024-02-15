if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

console.log(process.env.API_KEY)

const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate') //allows usage of <% layout('layouts/boilerplate') %> to send ejs to the 'boilersplate' template
const session = require('express-session')
const flash = require('express-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')

const ExpressError = require('./utils/ExpressError')
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')
const userRoutes = require('./routes/users')

const User = require('./models/user')

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error: '))
db.once('open', () => console.log('Database connected'))

const app = express()
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))
app.engine('ejs', ejsMate)

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, '/public')))
const sessionConfig = {
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: (1000 * 60 * 60 * 24 * 7)
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.currentUser = req.user

    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)
app.use('/', userRoutes)

app.get('/', (req, res) => {
    res.render('home')
})




app.all('*', (req, res, next) => {
    console.log(req.originalUrl)
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    console.log('******************')
    console.log('******************')
    console.log('MY ERROR MIDDLWEAR')
    console.log('******************')
    console.log('******************')
    
    const {status = 500} = err
    if(!err.message) {
        err.message = 'Something went wrong'
    }
    console.log(err)
    res.status(status).render('error', {err})
})


app.listen(3000, () => console.log('LISTENING ON PORT 3000'))