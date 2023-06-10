const express = require('express')
const router = express.Router()

const UserModel = require('../models/user')

router.post('/login', async (request, response) => {
    response.json({ message: "Login user" })
})

router.post('/register', async (request, response) => {
    response.json({ message: "Register user" })
})


module.exports = router