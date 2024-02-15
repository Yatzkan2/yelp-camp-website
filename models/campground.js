const mongoose = require('mongoose')
const Review = require('./review')

const Schema = mongoose.Schema

const campgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

campgroundSchema.post('findOneAndDelete', async (camp)=>{
    if(camp.reviews.length){
        await Review.deleteMany({_id: {$in: camp.reviews}})
    }
})

const Campground = mongoose.model('Campground',campgroundSchema)
module.exports = Campground;