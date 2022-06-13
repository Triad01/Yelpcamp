const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password);
        // to register ao user(this is made available by passport)
        req.login(registeredUser, err => {
            if (err) return next(err)
            req.flash('success', 'Welcome to Yelp Camp')
            res.redirect('/campgrounds')
            // (req.login)to automatically log in a registered user after registering(i.e establishes a login session)
        })

    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }

}

module.exports.renderLogin = (req, res) => {
    res.render('users/login')
}

module.exports.login = (req, res) => {
    // passport.authenticate would authenticate incoming requests
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    //deleting 'returnTo' from the session
    res.redirect(redirectUrl);
}

// logging out a user ====================================
//using passportv.6.0, (req.logout requires a call back)

// module.exports.login =  (req, res, next) => {
//     //     req.logout(function (err) {
//     //         if (err) { return next(err) }
//     //         req.flash('success', 'Goodbye!')
//     //         res.redirect('/campgrounds')

//     //     })
//     // }

module.exports.logout = (req, res) => {
    req.logout();
    // to establish a log out session
    req.flash('success', "Goodbye!");
    res.redirect('/campgrounds');
}