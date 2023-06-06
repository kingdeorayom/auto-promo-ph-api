const mongoose = require('mongoose')

const inquiriesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    // slug: {
    //     type: String,
    //     required: true
    // }
})

module.exports = mongoose.model('Inquiries', inquiriesSchema)