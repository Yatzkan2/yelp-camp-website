const User = require('../models/user')


module.exports.renderRegister = (req, res) => {
    res.render('users/register')
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login')
}

module.exports.register = async (req, res, next) => {
    try {
        const {username, email, password} = req.body
        const user = new User({username, email})
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            if(!err) {
                req.flash('success', 'Welcome to yelpCamp!')
                res.redirect('/campgrounds')
            } else {
                next(err)
            }
        })

    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}

module.exports.login = async (req, res) => {
    req.flash('success', 'Welcome Back!') 
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl)    
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}