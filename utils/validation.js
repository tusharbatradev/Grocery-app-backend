const validator = require("validator");

const validateSignUp = (req) => {
    const {firstName, lastName, email, password} = req.body

    if(!firstName.length || !lastName){
        throw new Error("Name is not valid")
    } else if(!validator.isEmail(email)){
        throw new Error("Email in not valid")
    } else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter a strong Password")
    }
}

module.exports = {
    validateSignUp,
}