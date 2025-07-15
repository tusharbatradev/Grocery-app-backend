const mongoose = require("mongoose");
const validator = require("validator")

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      maxLength: 50,
      validate(value) {
        function containsSpecialChars(str) {
          const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
          return specialChars.test(str);
        }
        if (containsSpecialChars(value)) {
          throw new Error("Cannot Contain Special Characterr");
        }
      },
    },
    lastName: {
      type: String,
      validate(value) {
        function containsSpecialChars(str) {
          const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
          return specialChars.test(str);
        }
        if (containsSpecialChars(value)) {
          throw new Error("Cannot Contain Special Characterr");
        }
      },
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      validate (value) {
        if(!validator.isEmail(value)){
            throw new Error("Invalid Email Address " + value)
        }
      }
    },
    password: {
      type: String,
      required: true,
      validate(value){
        if(!validator.isStrongPassword(value))  {
            throw new Error("Enter a valid Password "+ value)
        }
      }
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        const genderOptions = ["male", "female", "others"];
        if (!genderOptions.includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRISuukVSb_iHDfPAaDKboFWXZVloJW9XXiwGYFab-QwlAYQ3zFsx4fToY9ijcVNU5ieKk&usqp=CAU",
      validate(value){
        if(!validator.isURL(value)){
            throw new Error("Invalid photo URL")
        }
      }
    },
    about: {
      type: String,
      default: "This is a dummy about",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
