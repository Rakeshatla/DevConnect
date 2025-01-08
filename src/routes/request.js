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

requestRouter.post('/request/review/:status/:requestId', userauth, async (req, res) => {
    try {
        const { status, requestId } = req.params;
        // console.log(status)
        // console.log(requestId)
        const loggedIn = req.user
        // console.log(loggedIn)
        const allowedstatus = ["accepted", "rejected"]
        if (!allowedstatus.includes(status)) {
            throw new Error("status is invalid")
        }
        const connectionReq = await ConnectionRequest.findOne({
            _id: requestId, toUserId: loggedIn._id, status: "interested",
        })
        //if the connection is already accepted
        const isAlreadyAccepted = await ConnectionRequest.findOne({
            _id: requestId, toUserId: loggedIn._id, status: "accepted",
        })
        if (isAlreadyAccepted) {
            throw new Error("connection already accepted")
        }
        // console.log(connectionReq)
        if (!connectionReq) {
            throw new Error("no connection is present")
        }
        // res.send(connectionReq)
        connectionReq.status = status
        await connectionReq.save()
        res.send("connection accepted successfully")
    } catch (err) {
        res.status(404).send("Error " + err.message)
    }
})


module.exports = requestRouter;