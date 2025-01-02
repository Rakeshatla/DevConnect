const express = require('express');
const profileRouter = express.Router();
const userauth = require('../middleware/auth')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { profileUpdate } = require('../utils/validation')

profileRouter.get("/profile/view", userauth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user)
    } catch (err) {
        res.status(404).send("invalid credentials  " + err.message)
    }
})

profileRouter.patch("/profile/edit", userauth, async (req, res) => {
    try {
        if (!profileUpdate(req)) {
            throw new Error("can't update")
        }
        const loggedUser = req.user;
        Object.keys(req.body).forEach((key) => (
            loggedUser[key] = req.body[key]
        ))
        await loggedUser.save()
        res.send(loggedUser.firstName + 'update successful')
    } catch (err) {
        res.status(404).send("sorry " + err.message)
    }
})

module.exports = profileRouter;