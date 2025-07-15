const dotenv = require("dotenv");
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const User = require("./Models/users");

dotenv.config();
const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Skill validator
function checkSkills(skills) {
  return skills.length > 3 ? false : true;
}

// Add User
app.post("/signup", async (req, res) => {
  try {
    const user = new User(req.body);
    if (!checkSkills(user.skills)) {
      throw new Error("Cannot add skills more than 3");
    }
    await user.save();
    res.status(200).send("User Added Successfully" + user);
  } catch (err) {
    res.status(400).send("Error in adding user" + err.message);
  }
});

// All users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      res.status(404).send("Users not found");
    } else {
      res.status(200).send(users);
    }
  } catch (err) {
    res.status(400).send("Something went Wrong", err);
  }
});

// User by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.email;
  try {
    const users = await User.findOne({ email: userEmail });
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.status(200).send(users);
    }
  } catch (err) {
    res.status(400).send("Something went Wrong", err);
  }
});

// User by id
app.get("/user/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const users = await User.findById(userId);
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.status(200).send(users);
    }
  } catch (err) {
    res.status(400).send("Something went Wrong", err);
  }
});

// Delete User by id
app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findByIdAndDelete(id);

    res.status(200).send("User Deleted Succesfully" + user);
  } catch (err) {
    res.send("Something went wrong", err);
  }
});

// Patch user by id
app.patch("/update/:id", async (req, res) => {
  try {
    const id = req.params.id; 
    const data = req.body;

    // Allowed Updated
    const ALLOWED_UPDATES = [
      "firstName",
      "lastName",
      "age",
      "photoUrl",
      "age",
      "gender",
      "about",
      "skills"
    ];
    const isUpdateAllowed = Object.keys(data).every((k) => {
      return ALLOWED_UPDATES.includes(k);
    });
    if (!isUpdateAllowed) { 
      throw new Error("Update not allowed");
    }

    //  Checking skills should not more than 3
    if (!checkSkills(data?.skills)) {
      throw new Error("Cannot add skills more than 3");
    }

    const user = await User.findByIdAndUpdate(
      id,
      { ...data },
      {
        returnDocument: "before",
        runValidators: true,
      }
    );
    res.send("Updated Succesfully" + user);
  } catch (err) {
    res.status(404).send("Something Went Wrong:" + err.message);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
