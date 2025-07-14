const validator = require('validator')
const validateSignup = (req) => {
    const { firstName, lastName, email, password, skills, developerType, availability, location, lookingFor } = req.body;
    if (!firstName || !lastName) {
        throw new Error("plz enter name ");
    } else if (!validator.isEmail(email)) {
        throw new Error("plz enter correct email ");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("enter strong password ");
    }
}

const profileUpdate = (req) => {
    const allowedfields = ["firstName", "lastName", "password", "skills", "age", "gender", "photoUrl", "about", "skills", "developerType", "availability", "location", "lookingFor"];
    const isallowed = Object.keys(req.body).every((field) =>
        allowedfields.includes(field)
    );
    return isallowed;
}
module.exports = { validateSignup, profileUpdate };