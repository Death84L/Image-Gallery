const User = require("../Model/userModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
  try {
    const newPassword = await bcrypt.hash(req.body.password, 10);
    await User.create({
      username:req.body.username,
      name: req.body.name,
      email: req.body.email,
      password: newPassword,
    });
    res.json({ status: "ok" });
  } catch (error) {
    console.error("Error registering user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while registering the user." });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid login" });
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (isPasswordValid) {
      const token = jwt.sign(
        {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
        "secret123"
      );

      return res.status(200).json({ status: 'ok', user: token ,username :user.username});
    } else {
      return res.status(401).json({ status: 'error', user: false });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "An error occurred while logging in." });
  }
};

//get userdata
exports.getUserProfile = async (req, res) => {
  const username = req.params.username;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userProfile = {
      name: user.name,
      email: user.email,
      username: user.username,
      profession: user.profession,
    };

    return res.json(userProfile);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

//update userdata
exports.updateUserProfile = async (req, res) => {
  const username = req.params.username;
  const { name, email, profession } = req.body;

  try {
    // Assuming 'username' is unique in the database
    const updatedUser = await User.findOneAndUpdate(
      { username },
      { name, email, profession },
      { new: true } // Return the updated user data
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const userProfile = {
      name: updatedUser.name,
      email: updatedUser.email,
      username: updatedUser.username,
      profession: updatedUser.profession,
    };

    return res.json(userProfile);
  } catch (error) {
    console.error("Error updating user profile:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};