const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary')

//configuring cloudinary according to the docs
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})

//setting up mutter storage in cloudinary
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'Yelpcamp',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
})

module.exports = {
    cloudinary,
    storage
}

// you could always refer to the docs====