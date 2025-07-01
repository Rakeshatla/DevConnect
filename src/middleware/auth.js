const jwt = require('jsonwebtoken')
const User = require('../models/user')
const userauth = async (req, res, next) => {
    try {
        const cookies = req.cookies;
        // console.log(cookies)
        const { token } = cookies;
        if (!token) {
            throw new Error("token got expired ")
        }
        const decoded = await jwt.verify(token, process.env.JWT_SECRET)
        // console.log(decoded)
        const { _id } = decoded;
        const user = await User.findById(_id)
        if (!user) {
            throw new Error("user not found ")
        }
        req.user = user;
        next()
    } catch (err) {
        res.status(404).send("can't able to get the profile " + err.message)
    }


}
module.exports = userauth;