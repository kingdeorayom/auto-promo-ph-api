const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

const UserModel = require('../models/user')

const createToken = (_id) => {
    return jwt.sign({ _id: _id }, process.env.SECRET, { expiresIn: '3d' })
}

router.post('/login', async (request, response) => {

    const { email, password } = request.body

    try {
        const user = await UserModel.login(email, password)

        // create a token
        const token = createToken(user._id)

        response.status(200).json({ email, token })

    } catch (error) {
        response.status(400).json({ error: error.message })
    }

})

router.post('/register', async (request, response) => {

    const { email, password } = request.body

    try {
        const user = await UserModel.signup(email, password)

        // create a token
        const token = createToken(user._id)

        response.status(200).json({ email, token })

    } catch (error) {
        response.status(400).json({ error: error.message })
    }

})


module.exports = router