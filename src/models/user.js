const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50,
    },
    lastName: {
        type: String,

    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        required: true
    },
    password: {
        type: String,
        minLength: 8
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new error("plz check the gender");
            }
        }
    },
    skills: {
        type: [String],
    }
}, {
    timestamps: true
})
const User = mongoose.model("User", userSchema);
module.exports = User;