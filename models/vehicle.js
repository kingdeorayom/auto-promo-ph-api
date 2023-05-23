const mongoose = require('mongoose')

const vehicleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
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