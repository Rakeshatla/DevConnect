const express = require('express')
const requestRouter = express.Router();
const User = require('../models/user')
const userauth = require('../middleware/auth')
const ConnectionRequest = require('../models/ConnectionRequest')


requestRouter.post('/request/send/:status/:toUserId', userauth, async (req, res) => {
    try {
        const allowedstatus = ["interested", "ignored"]
        const formUserId = req.user._id
        const status = req.params.status
        const toUserId = req.params.toUserId
        const istoUserExist = await User.findById(toUserId)
        // console.log(istoUserExist)
        //to check the user present in db or not
        if (!istoUserExist) {
            throw new Error("User not exist")
        }
        if (!allowedstatus.includes(status)) {
            throw new Error("status is invalid")
        }
        //already the connection existing or not
        const isConnectionExit = await ConnectionRequest.findOne({
            $or: [
                {
                    formUserId, toUserId
                }, {
                    formUserId: toUserId, toUserId: formUserId
                }
            ]
        })
        if (isConnectionExit) {
            throw new Error("connection already made")
        }
        const connectionreq = new ConnectionRequest({
            formUserId, toUserId, status
        })
        await connectionreq.save();
        res.send(
            req.user.firstName + " is " + status + " in  " + istoUserExist.firstName
        )
    } catch (err) {
        res.status(404).send("Error " + err.message)
    }
})

module.exports = requestRouter;