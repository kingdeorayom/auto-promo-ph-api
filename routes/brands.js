const express = require('express')
const router = express.Router()

const BrandModel = require('../models/brand')
const VehicleModel = require('../models/vehicle')

// Getting all brands

router.get('/', async (request, response) => {
    try {
        const brands = await BrandModel.find()
        response.json(brands)
    } catch (error) {
        response.status(500).json({ message: error.message })
    }
})

// Getting one brand by id

router.get('/:id', getBrandById, (request, response) => {
    response.json(response.brand)
})

// Getting all vehicles by slug
router.get('/vehicle/:brand_slug', getVehicleByBrandSlug, (request, response) => {
    response.json(response.vehicle)
    // console.log(response.json())
})


// Creating one brand

// router.post('/', async (request, response) => {
//     const brand = new BrandModel({
//         name: request.body.name,
//         description: request.body.description
//         slug: request.body.slug
//     })

//     try {
//         const newBrand = await brand.save()
//         response.status(201).json(newBrand)
//     } catch (error) {
//         response.status(400).json({ message: error.message })
//     }
// })

// Middleware

// Get brand by id
async function getBrandById(request, response, next) {
    let brand

    try {
        brand = await BrandModel.findById(request.params.id)
        if (brand == null) {
            return response.status(404).json({ message: "Cannot find brand. It may not be existing in the database." })
        }
    } catch (error) {
        return response.status(500).json({ message: error.message })
    }

    response.brand = brand
    next()
}

// Get vehicle by brand
async function getVehicleByBrandSlug(request, response, next) {
    console.log(request.params)
    let vehicle
    try {
        vehicle = await VehicleModel.find({ brand_slug: request.params.brand_slug })
        if (vehicle == null) {
            return response.status(404).json({ message: "Cannot find vehicle. It may not be existing in the database." })
        }
    } catch (err) {
        return response.status(500).json({ message: err.message })
    }

    response.vehicle = vehicle
    next()
}

module.exports = router