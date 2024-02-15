const mongoose = require('mongoose')
const Campground = require('../models/campground')
const cities = require('./cities')
const {descriptors, places} = require('./seedHelpers')

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error: '))
db.once('open', () => console.log('Database connected'))

const sample = arr => arr[Math.floor(Math.random() * arr.length)]


const seedDB = async () => {
    await Campground.deleteMany({})

    for(let i = 0; i < 50; i++) {

        let randCity = sample(cities)
        let randPlace = sample(places)
        let randDescriptor = sample(descriptors)
        let price = Math.ceil(Math.random()*20) + 10   
        await new Campground({
            title: `${randDescriptor} ${randPlace}`, 
            location: `${randCity.city}, ${randCity.state}`,
            image: 'https://source.unsplash.com/collection/483251',
            price,
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consequuntur earum eligendi dolorem quaerat sequi obcaecati doloribus consequatur maxime, assumenda magni culpa, non fugit tenetur quam optio facere commodi? A, voluptatem.',
            author: '659a9642f888772072d8e45e'
        }).save()
    }
}

seedDB().then(() => {
    db.close().then(() => console.log('Database seeding done succesfully'))
})
