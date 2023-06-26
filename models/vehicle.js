const mongoose = require('mongoose')

const vehicleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    netPrice: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    transmission: {
        type: String,
        required: true
    },
    fuelType: {
        type: String,
        required: true
    },
    power: {
        type: Number,
        required: true
    },
    engineDisplacement: {
        type: Number,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    keyFeatures: {
        type: String,
        required: true
    },
    colors: {
        type: Array,
        required: true,
    },
    variants: {
        type: Array,
        required: false
    },
    vehicle_slug: {
        type: String,
        required: true
    },
    brand_slug: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('Vehicle', vehicleSchema)