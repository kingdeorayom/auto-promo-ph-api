const express = require('express')
const router = express.Router()

const VehicleModel = require('../models/vehicle')

router.get('/:keyword', async (request, response) => {

    let data = await VehicleModel.find({

        "$or": [
            { name: { $regex: request.params.keyword, $options: 'i' } },
            { brand: { $regex: request.params.keyword, $options: 'i' } },
            { model: { $regex: request.params.keyword, $options: 'i' } },
            { type: { $regex: request.params.keyword, $options: 'i' } },
        ]
    })

    response.send(data)

})


module.exports = router
