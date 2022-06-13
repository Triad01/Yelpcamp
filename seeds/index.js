const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');


mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () => {
    console.log('database connected')
})


// trying to populate the database===============================================
//everything well need to populate the database(seeds) needs to be here required here cuz thes is the mongoose app.

//so instead of doing the usual thing we do to pupulate our db(by creating instances of our model or insertMany, we simply do the below)




const sample = (array) => array[Math.floor(Math.random() * array.length)];


const seedDb = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Campground({
            author: "629481895cbd420a89337602",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            // image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aliquid, quam culpa quasi facilis, reiciendis consequatur dolorum, sequi fugiat doloribus ipsa aut eaque est corporis soluta exercitationem accusantium nisi veniam hic.',
            price,
            geometry:{ 
                type : "Point", 
                coordinates : [ 
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ] 
            
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dvidneho8/image/upload/v1654159968/Yelpcamp/yztnhzno6kp1rmdawk72.jpg',
                    filename: 'Yelpcamp/yztnhzno6kp1rmdawk72',
                },
                {
                    url: 'https://res.cloudinary.com/dvidneho8/image/upload/v1654499932/Yelpcamp/lkysmafjxdmew5bdy93r.jpg',
                    filename: 'Yelpcamp/elhl6wnt5y5cx02xmngb',
                },
                {
                    url: 'https://res.cloudinary.com/dvidneho8/image/upload/v1654499931/Yelpcamp/kf5thwtnnm6vifmfpxow.jpg',
                    filename: 'Yelpcamp/zaxyqtlunyfvoucnzjta'
                }
            ]
        })
        await camp.save()
    }

}

seedDb().then(() => {
    mongoose.connection.close()
})
