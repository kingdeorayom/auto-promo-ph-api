const express = require('express')
const router = express.Router()

const VehicleModel = require('../models/vehicle')

router.get('/:key', async (request, response) => {

    let data = await VehicleModel.find({

        "$or": [
            { name: { $regex: request.params.key, $options: 'i' } },
            { brand: { $regex: request.params.key, $options: 'i' } },
            { model: { $regex: request.params.key, $options: 'i' } },
            { type: { $regex: request.params.key, $options: 'i' } },
        ]
    })

    response.send(data)

})


module.exports = router
