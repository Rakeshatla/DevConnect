const express = require('express');
const profileRouter = express.Router();
const userauth = require('../middleware/auth')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { profileUpdate } = require('../utils/validation')
const validator = require('validator')
const bcrypt = require('bcrypt')

profileRouter.get("/profile/view", userauth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user)
    } catch (err) {
        res.status(401).send("invalid credentials  " + err.message)
    }
})

profileRouter.patch("/profile/edit", userauth, async (req, res) => {
    try {
        if (!profileUpdate(req)) {
            throw new Error("can't update")
        }
        const loggedInUser = req.user;
        // console.log(loggedUser)
        Object.keys(req.body).forEach((key) => (
            loggedInUser[key] = req.body[key]
        ))
        await loggedInUser.save()
        res.json({
            message: `${loggedInUser.firstName}, your profile updated successfuly`,
            data: loggedInUser,
        });
    } catch (err) {
        res.status(404).send("sorry " + err.message)
    }
})

profileRouter.patch("/profile/edit/password", userauth, async (req, res) => {
    //new password srenght check
    try {
        const { password } = req.body
        if (validator.isStrongPassword(password)) {
            const loggedInUser = req.user;
            // console.log(loggedInUser)
            const passwordhash = await bcrypt.hash(password, 10)
            loggedInUser.password = passwordhash
            await loggedInUser.save();
            res.send("updated successfully!!")
        } else {
            throw new Error("give a strong password")
        }

    } catch (err) {
        res.status(404).send("Error " + err.message)

    }
})

module.exports = profileRouter;