const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")

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
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email Address " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a valid Password " + value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enums : {
        values : ["male","female","others"],
        message : `{VALUE} is incorrect type`
      }
    },
    photoUrl: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRISuukVSb_iHDfPAaDKboFWXZVloJW9XXiwGYFab-QwlAYQ3zFsx4fToY9ijcVNU5ieKk&usqp=CAU",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid photo URL");
        }
      },
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

// JWT GET FUNCTION
userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user.id }, "DEV@Tinder$790", {
    expiresIn: "1d",
  });

  return token;
};

// BCRYPTING PASSWORD
userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);

  return isPasswordValid
};

module.exports = mongoose.model("User", userSchema);
