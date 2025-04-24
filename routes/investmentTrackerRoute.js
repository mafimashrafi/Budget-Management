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
    const {investmentName, investmentType, investedAmount, investingDate} = req.body;
    const user = await User.findById(id);
    const investments = await Investment.find({userID: id});

    let formatedDate;
    if (investingDate && investingDate.trim() !== "") {
        const [day, month, year] = investingDate.split('-').map(Number);
        formatedDate = new Date(year, month - 1, day);
    
        // Check if the parsed date is valid
        if (isNaN(formatedDate.getTime())) {
            console.log("Invalid date format, using today's date.");
            formatedDate = new Date(); // Fallback to the current date if parsing fails
        }
    } else {
        console.log("No date provided, using today's date.");
        formatedDate = new Date(); // Default to the current date if no date is provided
    }

    const newInvestment = await Investment({
        userID: id,
        investmentName: investmentName,
        investmentType: investmentType,
        investedAmount: investedAmount,
        investingDate: formatedDate, 
    });

    await newInvestment.save().then(()=>{
        res.redirect("/investmentTracker");
    }).catch((err)=>{
        console.log(err);
        res.render("investmentTracker.ejs", {error: "Failed to add", user, investments})
    });
});

router.get("/investment/:id/delete", verifyUser, async(req, res)=>{
    const {id} = req.params;
    const userID = req.userID;
    const user = await User.findById(userID);
    const investments = await Investment.find({userID: userID});

    await Investment.findByIdAndDelete(id).then(()=>{
        res.redirect("/investmentTracker");
    }).catch((err)=>{
        console.log(err);
        res.render("investmentTracker.ejs", {error: null, user, investments})
    });
})

module.exports = router;