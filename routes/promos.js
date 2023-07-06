const express = require('express')
const router = express.Router()

const VehicleModel = require('../models/vehicle')

// Getting all vehicle
router.get('/', async (request, response) => {
    try {
        const vehicle = await VehicleModel.find()
        response.json(vehicle)
    } catch (error) {
        response.status(500).json({ message: error.message })
    }
})

module.exports = router