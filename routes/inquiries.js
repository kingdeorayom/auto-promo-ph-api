const express = require('express')
const router = express.Router()

const InquiriesModel = require('../models/inquiries')

// Getting all inquiries

router.get('/', async (request, response) => {
    try {
        const brands = await InquiriesModel.find()
        response.json(brands)
    } catch (error) {
        response.status(500).json({ message: error.message })
    }
})

// Getting one inquiry by id

router.get('/:id', getInquiryById, (request, response) => {
    response.json(response.brand)
})

// Creating one brand

router.post('/', async (request, response) => {
    const inquiry = new InquiriesModel({
        name: request.body.name,
        email: request.body.email,
        mobileNumber: request.body.mobileNumber,
        message: request.body.message
    })

    try {
        const newInquiry = await inquiry.save()
        response.status(201).json(newInquiry)
    } catch (error) {
        response.status(400).json({ message: error.message })
    }
})

// Middleware

// Get inquiry by id
async function getInquiryById(request, response, next) {
    let inquiry

    try {
        inquiry = await InquiriesModel.findById(request.params.id)
        if (inquiry == null) {
            return response.status(404).json({ message: "Cannot find inquiry. It may not be existing in the database." })
        }
    } catch (error) {
        return response.status(500).json({ message: error.message })
    }

    response.inquiry = inquiry
    next()
}

module.exports = router