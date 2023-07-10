const express = require('express')
const router = express.Router()

const VehicleModel = require('../models/vehicle')

router.get('/:keyword', async (request, response) => {

    try {
        let data = await VehicleModel.find({

            "$or": [
                { name: { $regex: request.params.keyword, $options: 'i' } },
                { brand: { $regex: request.params.keyword, $options: 'i' } },
                { model: { $regex: request.params.keyword, $options: 'i' } },
                { bodyType: { $regex: request.params.keyword, $options: 'i' } }
            ]
        })

        response.send(data)
    } catch (error) {
        response.status(500).json({ message: error.message })
    }

})

router.get('/budget/:keyword', async (request, response) => {

    try {
        let data = await VehicleModel.find({
            unitPrice: { $lte: request.params.keyword }
        })

        response.send(data)
    } catch (error) {
        response.status(500).json({ message: error.message })
    }

})


module.exports = router
