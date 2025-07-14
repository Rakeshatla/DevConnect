const express = require('express')
const authRouter = express.Router();
const { validateSignup } = require('../utils/validation')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')
authRouter.post('/signup', async (req, res) => {
    try {
        //validation of api
        validateSignup(req);
        //hashing of password
        const { firstName, lastName, email, password, skills, developerType, availability, location, lookingFor } = req.body;
        const passwordhash = await bcrypt.hash(password, 10)
        // const data = req.body
        const user = new User({
            firstName, lastName, email, password: passwordhash, skills, developerType, availability, location, lookingFor
        });
        await user.save();
        // if (data.skills.length > 10) {
        //     throw new Error("caan't be more than 10")
        // }
        const isProduction = process.env.NODE_ENV === "production";

        const token = await jwt.sign(
            { _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,                      // HTTPS only in production
            sameSite: isProduction ? "None" : "Lax",   // Allow cross-site cookies in production
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
        });


        res.send(user);
    }
    catch (err) {
        res.status(404).send("Error " + err.message)
    }
})

authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email })
        if (!user) {
            throw new Error("invalid credentials ")
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (isPasswordValid) {
            //jwt token
            const isProduction = process.env.NODE_ENV === "production";

            const token = await jwt.sign(
                { _id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );

            res.cookie("token", token, {
                httpOnly: true,
                secure: isProduction,                      // HTTPS only in production
                sameSite: isProduction ? "None" : "Lax",   // Allow cross-site cookies in production
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
            });

            res.send(user);

        } else {
            throw new Error("invalid credentials ")
        }
    } catch (err) {
        res.status(404).send("Error: " + err.message)
    }
})

authRouter.post("/logout", async (req, res) => {
    res.cookie('token', null, {
        expires: new Date(Date.now())
    })
    res.send("logut successfull")
})
module.exports = authRouter;