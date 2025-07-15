const express = require("express");
const userauth = require('../middleware/auth');
const { Chat } = require("../models/chat");

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userauth, async (req, res) => {
    const { targetUserId } = req.params;
    const userId = req.user._id;
    // console.log(userId)
    try {
        let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
        }).populate({
            path: "messages.senderId",
            select: "firstName lastName",
        });
        if (!chat) {
            chat = new Chat({
                participants: [userId, targetUserId],
                messages: [],
            });
            await chat.save();
        }
        res.json(chat);
    } catch (err) {
        console.error(err);
    }
});

module.exports = chatRouter;