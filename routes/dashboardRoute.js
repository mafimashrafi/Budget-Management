const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const verifyUser = require("../middlewares/authMiddleware.js");

router.get("/dashboard", verifyUser, async (req, res)=>{
    const userID = req.userID;
    const user = await User.findById(userID);
    res.render("dashboard.ejs", {user, currentPage: 'dashboard'})
});

module.exports=router;