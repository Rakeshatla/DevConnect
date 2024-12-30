const validator = require('validator')
const validateSignup = (req) => {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName) {
        throw new Error("plz enter name ");
    } else if (!validator.isEmail(email)) {
        throw new Error("plz enter correct email ");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("enter strong password ");
    }
}

module.exports = validateSignup;