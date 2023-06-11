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

// Getting featured vehicles
// router.get('/featured', async (request, response) => {
//     try {
//         const vehicle = await VehicleModel.find()
//         response.json(vehicle)
//     } catch (error) {
//         response.status(500).json({ message: error.message })
//     }
// })

// Getting featured vehicles
router.get('/featured', getFeaturedVehicles, (request, response) => {
    response.json(response.vehicle)
})

// Getting suggested vehicles
router.get('/suggested/:brand_slug', getSuggestedVehicles, (request, response) => {
    response.json(response.vehicle)
})

// Creating one vehicle
router.post('/', async (request, response) => {

    const data = new VehicleModel({
        name: request.body.name,
        price: request.body.price,
        description: request.body.description,
        image: request.body.image,
        brand: request.body.brand,
        model: request.body.model,
        type: request.body.type,
        transmission: request.body.transmission,
        fuelType: request.body.fuelType,
        year: request.body.year,
        keyFeatures: request.body.keyFeatures,
        vehicle_slug: request.body.vehicle_slug,
        brand_slug: request.body.brand_slug
    })

    try {

        const nameExists = await VehicleModel.findOne({ name: request.body.name })
        const vehicleSlugExists = await VehicleModel.findOne({ vehicle_slug: request.body.vehicle_slug })

        if (nameExists) {
            response.status(400).json({ message: "There is already a vehicle with this name in the database. Please try another one." })
        } else if (vehicleSlugExists) {
            response.status(400).json({ message: "There is already a vehicle with this slug in the database. Please try another one." })
        } else {
            const vehicle = await data.save()
            response.status(201).json(vehicle)
        }

    } catch (error) {
        response.status(400).json({ message: error.message })
    }
})

// Getting one vehicle by id
router.get('/:id', getVehicleById, (request, response) => {
    response.json(response.vehicle)
})

// Getting one vehicle by vehicle slug
router.get('/detail/:vehicle_slug', getVehicleBySlug, (request, response) => {
    response.json(response.vehicle)
})

// Updating one vehicle by id
router.patch('/:id', getVehicleById, async (request, response) => {

    if (request.body.name != null) {
        response.vehicle.name = request.body.name
    }

    try {
        const updatedVehicle = await response.vehicle.save()
        response.json(updatedVehicle)
    } catch (err) {
        response.status(400).json({ message: err.message })
    }
})

// Deleting one vehicle by id
router.delete('/:id', getVehicleById, async (request, response) => {
    try {
        await response.vehicle.deleteOne()
        response.json({ message: 'Successfully deleted vehicle' })
    } catch (err) {
        response.status(500).json({ message: err.message })
    }
})

// // Getting vehicles by brand
// router.get('/:brand', getVehicleByBrand, (request, response) => {
//     response.json(response.vehicle)
// })

// Middleware

// Get vehicle by brand
// async function getVehicleByBrand(request, response, next) {
//     let vehicle
//     try {
//         vehicle = await VehicleModel.find({ brand: request.params.brand })
//         if (vehicle == null) {
//             return response.status(404).json({ message: "Cannot find vehicle. It may not be existing in the database, or there's an error that still needs to be fixed. If the issue persists, please report it immediately." })
//         }
//     } catch (err) {
//         return response.status(500).json({ message: err.message })
//     }

//     response.vehicle = vehicle
//     next()
// }

// Get vehicle by id
async function getVehicleById(request, response, next) {

    let vehicle

    try {
        vehicle = await VehicleModel.findById(request.params.id)
        if (vehicle == null) {
            return response.status(404).json({ message: "Cannot find vehicle. It may not be existing in the database, or there's an error that still needs to be fixed. If the issue persists, please report it immediately." })
        }
    } catch (err) {
        return response.status(500).json({ message: err.message })
    }

    response.vehicle = vehicle
    next()
}

// Get vehicle by vehicle slug
async function getVehicleBySlug(request, response, next) {

    let vehicle

    try {
        vehicle = await VehicleModel.findOne({ vehicle_slug: request.params.vehicle_slug })
        if (vehicle == null) {
            return response.status(404).json({ message: "Cannot find vehicle. It may not be existing in the database, or there's an error that still needs to be fixed. If the issue persists, please report it immediately." })
        }
    } catch (err) {
        return response.status(500).json({ message: err.message })
    }

    response.vehicle = vehicle
    next()
}

// Get featured vehicles
async function getFeaturedVehicles(request, response, next) {

    let vehicle

    try {
        vehicle = await VehicleModel.aggregate([{ $sample: { size: 4 } }])
        if (vehicle == null) {
            return response.status(404).json({ message: "Cannot find vehicle. It may not be existing in the database, or there's an error that still needs to be fixed. If the issue persists, please report it immediately." })
        }
    } catch (err) {
        return response.status(500).json({ message: err.message })
    }

    response.vehicle = vehicle
    next()
}

// Get featured vehicles
async function getSuggestedVehicles(request, response, next) {

    let vehicle

    try {
        vehicle = await VehicleModel.aggregate([
            { $match: { brand_slug: request.params.brand_slug } },
            { $sample: { size: 4 } }
        ])
        if (vehicle == null) {
            return response.status(404).json({ message: "Cannot find vehicle. It may not be existing in the database, or there's an error that still needs to be fixed. If the issue persists, please report it immediately." })
        }
    } catch (err) {
        return response.status(500).json({ message: err.message })
    }

    response.vehicle = vehicle
    next()
}



module.exports = router
