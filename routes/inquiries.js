const express = require('express')
const router = express.Router()

const InquiriesModel = require('../models/inquiries')
const moment = require('moment')

// Getting all inquiries

router.get('/', async (request, response) => {
    try {
        const inquiries = await InquiriesModel.find()
        response.json(inquiries)
    } catch (error) {
        response.status(500).json({ message: error.message })
    }
})

// Getting one inquiry by id

router.get('/:id', getInquiryById, (request, response) => {
    response.json(response.inquiry)
})

// Creating one inquiry

router.post('/', async (request, response) => {

    const inquiry = new InquiriesModel({
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        email: request.body.email,
        mobileNumber: request.body.mobileNumber,
        message: request.body.message,
        vehicleSlug: request.body.vehicleSlug,
        date: moment().format('M/D/Y hh:mm A')
    })

    try {
        const newInquiry = await inquiry.save()
        response.status(201).json(newInquiry)
    } catch (error) {
        response.status(400).json({ message: error.message })
    }
})

// Getting all inquiries

router.delete('/', async (request, response) => {
    try {
        const inquiries = await InquiriesModel.deleteMany({})
        response.json(inquiries)
    } catch (error) {
        response.status(500).json({ message: error.message })
    }
})


// Deleting one inquiry by id
router.delete('/:id', getInquiryById, async (request, response) => {
    try {
        await response.inquiry.deleteOne()
        response.json({ message: 'Successfully deleted inquiry' })
    } catch (err) {
        response.status(500).json({ message: err.message })
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