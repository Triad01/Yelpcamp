const express = require('express');
const router = express.Router();
const passport = require('passport')
const catchAsync = require('../utils/catchAsync')
const User = require('../models/user');
const users = require('../controllers/users')

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register))


router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)
// In this route, passport.authenticate() is a passport middleware which will authenticate the request. By default, when authentication succeeds, the req.user property is set to the authenticated user, a session is established, and the next function in the stack is called. This next function is typically application-specific logic which will process the request on behalf of the user.


router.get('/logout', users.logout)



module.exports = router;


