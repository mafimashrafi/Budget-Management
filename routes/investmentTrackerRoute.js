const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const verifyUser = require("../middlewares/authMiddleware.js");
const Investment = require("../models/investmentTracker.js");

router.get("/investmentTracker", verifyUser, async (req, res)=>{
    const userID = req.userID;
    const user = await User.findById(userID);
    const investments = await Investment.find({userID: userID});
    res.render("investmentTracker.ejs", {error: null, user, investments});
});

router.post("/investment/:id/add", verifyUser, async(req, res)=>{
    const {id} = req.params;
    const {investmentname, investmentType, investedAmount, investingDate} = req.body;
})

module.exports = router;