const mongoose = require('mongoose')
const connectionschema = new mongoose.Schema({
    formUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    status: {
        type: String,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: '{VALUE} is not valid'
        }
    }
}, {
    timestamps: true
})

connectionschema.index({ formUserId: 1, toUserId: 1 })

connectionschema.pre("save", function (next) {
    //to check if same user id sending request to him
    const ConnectionRequest = this
    if (ConnectionRequest.formUserId.equals(ConnectionRequest.toUserId)) {
        throw new Error("can't request to youself")
    }
    next();
});

module.exports = mongoose.model('ConnectionRequest', connectionschema);