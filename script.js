const dotenv = require("dotenv");
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const User = require("./Models/users");
const { validateSignUp } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

// Routes
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/users")

// Calling Funtions
dotenv.config();
const app = express();
connectDB();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Calling Routes
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);


// app.get("/profile", userAuth, async (req, res) => {
//   try {
//     const user = req.user;

//     if (!user) {
//       throw new Error("User doesn't exist");
//     }

//     res.send(user);
//   } catch (err) {
//     res.status(400).send("ERROR :" + err);
//   }
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
