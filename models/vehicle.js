const mongoose = require('mongoose')

const vehicleSchema = new mongoose.Schema({

    name: { type: String, required: true },
    description: { type: String, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    bodyType: { type: String, required: true },
    fuelType: { type: String, required: true },
    year: { type: String, required: true },
    image: { type: String, required: true },
    extraImages: { type: Array, required: true },

    unitPrice: { type: Number, required: true },
    netPrice: { type: Number, required: true },
    downpayment: { type: Number, required: true },
    amortization: { type: Number, required: true },

    overallLength: { type: String, required: false },
    overallWidth: { type: String, required: false },
    overallHeight: { type: String, required: false },
    wheelbase: { type: String, required: false },
    tread: { type: String, required: false },
    minimumTurningRadius: { type: String, required: false },
    minimumGroundClearance: { type: String, required: false },
    approachAngle: { type: String, required: false },
    rampBreakoverAngle: { type: String, required: false },
    departureAngle: { type: String, required: false },

    numberOfCylinders: { type: String, required: false },
    numberOfValves: { type: String, required: false },
    pistonDisplacement: { type: String, required: false },
    maximumOutput: { type: String, required: false },
    maximumTorque: { type: String, required: false },

    transmissionType: { type: String, required: true },
    driveSystem: { type: String, required: false },

    steering: { type: String, required: false },
    brakes: { type: String, required: false },
    suspension: { type: String, required: false },
    tyres: { type: String, required: false },

    seatingCapacity: { type: String, required: false },
    luggageCapacity: { type: String, required: false },
    fuelTankCapacity: { type: String, required: false },

    kerbWeight: { type: String, required: false },
    grossWeight: { type: String, required: false },

    colors: { type: Array, required: true, },
    variants: { type: Array, required: false },

    vehicle_slug: { type: String, required: true },
    brand_slug: { type: String, required: true },

    // name: { type: String, required: true },
    // unitPrice: { type: Number, required: true },
    // netPrice: { type: Number, required: true },
    // downpayment: { type: Number, required: true },
    // amortization: { type: Number, required: true },
    // description: { type: String, required: true },
    // image: { type: String, required: true },
    // extraImages: { type: Array, required: true },
    // brand: { type: String, required: true },
    // model: { type: String, required: true },
    // bodyType: { type: String, required: true },
    // fuelType: { type: String, required: true },
    // year: { type: String, required: true },
    // colors: { type: Array, required: true, },
    // variants: { type: Array, required: false },
    // vehicle_slug: { type: String, required: true },
    // brand_slug: { type: String, required: true },
})

module.exports = mongoose.model('Vehicle', vehicleSchema)