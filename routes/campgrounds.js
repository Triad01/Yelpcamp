const express = require('express')
const router = express.Router()
const campgrounds = require('../controllers/campgrounds')
const catchAsync = require('../utils/catchAsync')
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware')
const multer = require('multer')
// const upload = multer({ dest: 'uploads/' })
// the above line stores the images locally under the uploads folde
const { storage } = require('../cloudinary')
const upload = multer({ storage });
//this one now stores images on cloudinary

const Campground = require('../models/campground')


// routes with similar paths(even with same http verbs) can be grouped together using router.route()method=======

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))
// .post(upload.array('image'), (req, res) => {
//     console.log(req.body, req.files);
//     res.send('it worked')
// })
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, catchAsync(campgrounds.deleteCampground))




router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))





module.exports = router;