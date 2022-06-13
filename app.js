// if (process.env.NODE_ENV !== 'production') {
//     require('dotenv').config()
// }

require('dotenv').config()
// console.log(process.env.CLOUDINARY_SECRET)

const express = require('express')
const res = require('express/lib/response')
const app = express()
const path = require('path')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const ExpressError = require('./utils/ExpressErrors')
const passport = require('passport')
const localStrategy = require('passport-local')
const User = require('./models/user')
const mongoSanitize = require('express-mongo-sanitize')
// const helmet = require('helmet')

const userRoutes = require('./routes/users')
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')

//to now store session on mongo instead of the deafult memory store
const MongoDBStore = require('connect-mongo')(session)

const mongoose = require('mongoose')
const user = require('./models/user')

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp'
// 'mongodb://localhost:27017/yelp-camp'

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () => {
    console.log('database connected')
})


app.engine('ejs', ejsMate)
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));
app.use(mongoSanitize())
app.use(express.static(path.join(__dirname, 'public')))

const secret = process.env.SECRET || 'thishouldbeabettersecret';

const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
})

store.on('error', function (e) {
    console.log('session stroe error', e);
})

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        // secure: true,
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash())
// app.use(helmet())



// configuring passport and passportLocal=====

app.use(passport.initialize());
app.use(passport.session());
//passport.session must come after the main app.use(session())
passport.use(new localStrategy(User.authenticate()))

//deals with how info is stored and retrieved from the session
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    if (!['/login', '/'].includes(req.originalUrl)) {
        req.session.returnTo = req.originalUrl;
    }
    res.locals.currentUser = req.user;
    // req.user contains information of a currently signed in user and is going to be filled in with the deserialized info from the session... if no user, it gives undefined
    //access current user from all template
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

//Route handlers below
// by default, you wont have access to this id(in the next immediate route) unless you merge it in your review route===========
app.use('/', userRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)
app.use('/campgrounds', campgroundRoutes)
app.get('/', (req, res) => {
    res.render('home')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('page not found', 404))
})

app.use((err, req, res, next) => {
    // const { message = 'something went wrong', statusCode = 500 } = err;
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh no! something went wrong'
    res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
    console.log('listening on port 3000');
})

