const express = require('express')
const userRouter = express.Router();
const userauth = require('../middleware/auth');
const ConnectionRequest = require('../models/ConnectionRequest');

userRouter.get('/user/requests', userauth, async (req, res) => {
    try {
        const loggedIn = req.user
        const connections = await ConnectionRequest.find({
            toUserId: loggedIn._id, status: "interested"
        }).populate('formUserId', ['firstName', "age"])
        res.send(connections)
    } catch (err) {
        res.status(404).send("Error " + err.message)
    }
})



module.exports = userRouter;