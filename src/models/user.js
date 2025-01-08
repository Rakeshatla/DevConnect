const mongoose = require('mongoose');
const validator = require('validator')
//indexing on mongodb
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
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("enter correct email " + value);
            }
        },
    },
    password: {
        type: String,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("enter strong password " + value);
            }
        },
    },
    age: {
        type: Number,
        min: 18
    },
    about: {
        type: String,
        default: "Rappa Rappa"
    }
    ,
    photoUrl: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/3846/3846972.png"
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