const express = require('express')
const userRouter = express.Router();
const userauth = require('../middleware/auth');
const ConnectionRequest = require('../models/ConnectionRequest');
const User = require('../models/user');

const DATA = ['firstName', 'lastName', 'age', 'gender', 'photoUrl']

userRouter.get('/user/requests', userauth, async (req, res) => {
    try {
        const loggedIn = req.user
        const connections = await ConnectionRequest.find({
            toUserId: loggedIn._id, status: "interested"
        }).populate('formUserId', ['firstName', "age"])

        if (connections.length === 0) {
            throw new Error("No requests")
        }
        const data = await connections.map((row) => row.formUserId)
        res.json({ message: "requests are", data })
    } catch (err) {
        res.status(404).send("Error " + err.message)
    }
})

userRouter.get('/user/connections', userauth, async (req, res) => {
    try {
        const DATA = ['firstName', 'age', 'gender', 'photoUrl', 'about']
        const loggedIn = req.user
        const connections = await ConnectionRequest.find({
            $or: [{
                formUserId: loggedIn._id, status: "accepted"
            }, { toUserId: loggedIn._id, status: "accepted" }]
        }).populate('formUserId', DATA).populate('toUserId', DATA)
        const data = await connections.map((row) => {
            if (row.formUserId._id.toString() === loggedIn._id.toString()) {
                return row.toUserId
            }
            return row.formUserId
        })
        if (!data) {
            res.send("No Connections")
        }
        res.json({
            message: "fetched successfully", data
        })
    } catch (err) {
        res.status(404).send("Error " + err.message)
    }

})

userRouter.get('/user/feed', userauth, async (req, res) => {
    try {
        const page = req.query.page
        var limit = req.query.limit
        const skip = (page - 1) * limit
        limit = limit > 50 ? 50 : limit;
        const loggedIn = req.user

        const connections = await ConnectionRequest.find({
            $or: [{
                formUserId: loggedIn._id
            }, {
                toUserId: loggedIn._id
            }]
        })
        const hideFromFeed = new Set();
        connections.forEach((req) => {
            hideFromFeed.add(req.formUserId._id.toString())
            hideFromFeed.add(req.toUserId._id.toString())
        })
        // console.log(hideFromFeed)
        const feed = await User.find({
            $and: [{
                _id: { $ne: loggedIn._id }
            }, {
                _id: { $nin: Array.from(hideFromFeed) }
            }]
        }).select(DATA).skip(skip).limit(limit)
        res.send(feed)
    }
    catch (err) {
        res.status(404).send("Error " + err.message)
    }
})

module.exports = userRouter;