const express = require('express')
const requestRouter = express.Router();
const User = require('../models/user')
const userauth = require('../middleware/auth')

requestRouter.post('/sendconnection', userauth, (req, res) => {
    try {
        const user = req.user
        res.send(user.firstName + ' sent connection')
    } catch (err) {
        res.status(404).send("can't send connection")
    }
})

module.exports = requestRouter;