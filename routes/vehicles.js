require('dotenv').config()

const express = require('express')
const router = express.Router()
const path = require('path')

const multer = require('multer')

const VehicleModel = require('../models/vehicle')

const firebase = require("firebase/app");
const { getStorage, ref, uploadBytesResumable, getDownloadURL } = require("firebase/storage");

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

firebase.initializeApp(firebaseConfig);

const storage = getStorage();

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

const upload = multer({ storage: multer.memoryStorage() })

var multipleUpload = upload.fields([{ name: 'colors[]' }, { name: 'image' }, { name: 'extraImages[]' }])

// Creating one vehicle
router.post('/', multipleUpload, async (request, response) => {

    let mainImageURL
    let extraImagesURL
    let colorsURL

    try {
        const mainImageStorageRef = ref(storage, `files/auto-promo-ph-${Date.now()}-${request.files.image[0].originalname}`);
        const mainImageMetadata = { contentType: request.files.image[0].mimetype };
        const mainImageSnapshot = await uploadBytesResumable(mainImageStorageRef, request.files.image[0].buffer, mainImageMetadata);
        mainImageURL = await getDownloadURL(mainImageSnapshot.ref);
    } catch (error) {
        response.status(400).json({ message: error.message })
    }

    try {

        extraImagesURL = await Promise.all(request.files['extraImages[]'].map(async (item) => {
            const extraImagesStorageRef = ref(storage, `files/auto-promo-ph-${Date.now()}-${item.originalname}`);
            const extraImagesMetaData = { contentType: item.mimetype };
            const extraImagesSnapshot = await uploadBytesResumable(extraImagesStorageRef, item.buffer, extraImagesMetaData);
            return await getDownloadURL(extraImagesSnapshot.ref)
        }))

    } catch (error) {
        response.status(400).json({ message: error.message })
    }

    try {

        colorsURL = await Promise.all(request.files['colors[]'].map(async (item) => {
            const colorsStorageRef = ref(storage, `files/auto-promo-ph-${Date.now()}-${item.originalname}`);
            const colorsMetaData = { contentType: item.mimetype };
            const colorsSnapshot = await uploadBytesResumable(colorsStorageRef, item.buffer, colorsMetaData);
            return await getDownloadURL(colorsSnapshot.ref)
        }))

    } catch (error) {
        response.status(400).json({ message: error.message })
    }

    const data = new VehicleModel({
        name: request.body.name,
        price: request.body.price,
        netPrice: request.body.netPrice,
        downpayment: request.body.downpayment,
        amortization: request.body.amortization,
        description: request.body.description,
        image: mainImageURL,
        extraImages: extraImagesURL,
        brand: request.body.brand,
        model: request.body.model,
        type: request.body.type,
        transmission: request.body.transmission,
        fuelType: request.body.fuelType,
        power: request.body.power,
        engineDisplacement: request.body.engineDisplacement,
        year: request.body.year,
        keyFeatures: request.body.keyFeatures,
        colors: colorsURL,
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

    let mainImagePath
    let extraImagesPath

    try {
        mainImagePath = request.files.image[0].destination.substring(1) + "/" + request.files.image[0].filename
        extraImagesPath = request.files['extraImages[]'].map((item) => {
            return item.destination.substring(1) + "/" + item.filename
        })
    } catch (error) {
        response.status(400).json({ message: "Update error. All Vehicle Images are required." })
    }

    try {
        const vehicle = await VehicleModel.updateOne(
            {
                "_id": request.params.id
            },
            {
                $set: {
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
                }
            }
        )
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
