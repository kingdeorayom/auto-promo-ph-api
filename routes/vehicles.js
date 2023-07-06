const express = require('express')
const router = express.Router()
const path = require('path')

const multer = require('multer')

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
router.get('/featured', getFeaturedVehicles, (request, response) => {
    response.json(response.vehicle)
})

// Getting suggested vehicles
router.get('/suggested/:brand_slug', getSuggestedVehicles, (request, response) => {
    response.json(response.vehicle)
})

const storageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images/vehicles')
    },
    filename: (req, file, cb) => {
        // console.log(file)
        cb(null, "auto-promo-ph-" + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storageEngine })

var multipleUpload = upload.fields([{ name: 'image' }, { name: 'extraImages[]' }])

// Creating one vehicle
router.post('/', multipleUpload, async (request, response) => {

    const mainImagePath = request.files.image[0].destination.substring(1) + "/" + request.files.image[0].filename

    const extraImagesPath = request.files['extraImages[]'].map((item) => {
        return item.destination.substring(1) + "/" + item.filename
    })

    const data = new VehicleModel({
        name: request.body.name,
        price: request.body.price,
        netPrice: request.body.netPrice,
        downpayment: request.body.downpayment,
        amortization: request.body.amortization,
        description: request.body.description,
        image: mainImagePath,
        extraImages: extraImagesPath,
        brand: request.body.brand,
        model: request.body.model,
        type: request.body.type,
        transmission: request.body.transmission,
        fuelType: request.body.fuelType,
        power: request.body.power,
        engineDisplacement: request.body.engineDisplacement,
        year: request.body.year,
        keyFeatures: request.body.keyFeatures,
        colors: request.body.colors,
        variants: request.body.variants,
        vehicle_slug: request.body.vehicle_slug,
        brand_slug: request.body.brand_slug
    })

    try {

        const nameExists = await VehicleModel.findOne({ name: request.body.name })
        const vehicleSlugExists = await VehicleModel.findOne({ vehicle_slug: request.body.vehicle_slug })

        if (nameExists) {
            response.status(400).json({ message: "There is already a vehicle with this name in the database. Please try another one." })
        } else if (vehicleSlugExists) {
            response.status(400).json({ message: "There is already a vehicle with this URL slug in the database. Slugs are generated based on the name of the vehicle. Try changing the name of the vehicle you're about to add." })
        } else {
            const vehicle = await data.save()
            response.status(201).json(vehicle)
        }

    } catch (error) {
        response.status(400).json({ message: error.message })
    }
})

// Updating one vehicle
router.patch('/:id', multipleUpload, async (request, response) => {

    const mainImagePath = request.files.image[0].destination.substring(1) + "/" + request.files.image[0].filename

    const extraImagesPath = request.files['extraImages[]'].map((item) => {
        return item.destination.substring(1) + "/" + item.filename
    })

    const data = new VehicleModel({
        name: request.body.name,
        price: request.body.price,
        netPrice: request.body.netPrice,
        downpayment: request.body.downpayment,
        amortization: request.body.amortization,
        description: request.body.description,
        image: mainImagePath,
        extraImages: extraImagesPath,
        brand: request.body.brand,
        model: request.body.model,
        type: request.body.type,
        transmission: request.body.transmission,
        fuelType: request.body.fuelType,
        power: request.body.power,
        engineDisplacement: request.body.engineDisplacement,
        year: request.body.year,
        keyFeatures: request.body.keyFeatures,
        colors: request.body.colors,
        variants: request.body.variants,
        vehicle_slug: request.body.vehicle_slug,
        brand_slug: request.body.brand_slug
    })

    try {

        const vehicle = await VehicleModel.findByIdAndUpdate(request.params.id, data, { new: true })
        response.status(200).json(vehicle)

    } catch (error) {
        console.log(error)
        response.status(400).json({ message: "Update failed." })
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

// Getting one vehicle by vehicle slug
router.get('/variant/detail/', getVariantsBySlug, (request, response) => {
    response.json(response.vehicle)
})

// // Getting one vehicle by vehicle slug
// router.get('/promos/detail/', getVariantsBySlug, (request, response) => {
//     response.json(response.vehicle)
// })


// Deleting one vehicle by id
router.delete('/:id', getVehicleById, async (request, response) => {
    try {
        await response.vehicle.deleteOne()
        response.json({ message: 'Successfully deleted vehicle' })
    } catch (err) {
        response.status(500).json({ message: err.message })
    }
})

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

// Get variants by vehicle slug
async function getVariantsBySlug(request, response, next) {

    let vehicle

    // const slugs = ['suzuki-swift', 'toyota-corolla']

    console.log(request.query.vehicleSlug)

    try {
        vehicle = await VehicleModel.find({ vehicle_slug: request.query.vehicleSlug })
        if (vehicle == null) {
            return response.status(404).json({ message: "Cannot find vehicle variants. It may not be existing in the database, or there's an error that still needs to be fixed. If the issue persists, please report it immediately." })
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
        vehicle = await VehicleModel.aggregate([{ $sample: { size: 10 } }])
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
            { $sample: { size: 10 } }
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
