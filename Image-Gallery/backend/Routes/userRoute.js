const express = require("express");
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require("../Controllers/userController");
const router = express.Router();



router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/profile/:username").get(getUserProfile);
router.route("/profile/:username").put(updateUserProfile);



module.exports = router;
