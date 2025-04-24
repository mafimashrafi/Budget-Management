const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const verifyUser = require("../middlewares/authMiddleware.js");
const EmergencyFund = require("../models/emergency.js");

router.get("/emergency", verifyUser, async(req, res)=>{
    const userID = req.userID;
    const user = await User.findById(userID);
    const emergencyFund = await EmergencyFund.find({userID: userID});
    res.render("emergency.ejs", {error: null, user, emergencyFund});
});

router.post("/emergency/:id/add", verifyUser, async(req, res)=>{
    const {id} = req.params;
    const {targetfund, depositedAmount, note, depositeDate} = req.body;
    const user = await User.findById(id);
    const emergencyFund = await EmergencyFund.find({userID: id});

    let currentFund = Number(depositedAmount);
    for (let fund of emergencyFund) {
        currentFund += Number(fund.currentfund); 
    }

    const [day, month, year] = depositeDate.split(/[ -/|:;,]/).map(Number);
    const formatedDate = new Date(year, month - 1, day);

    const fund = new EmergencyFund({
        userID: id,
        targetfund: targetfund,
        currentfund: currentFund,
        depositedAmount: depositedAmount,
        note: note,
        date: formatedDate,
    });

    await fund.save().then(()=>{
        res.redirect("/emergency");
    }).catch((err)=>{
        console.log(err);
        res.render("emergency.ejs", {error: 'Failed to add', user, emergencyFund})
    });
});

router.get("/emergency/:id/delete", verifyUser, async(req, res)=>{
    const {id} = req.params;

    const userID = req.userID;
    const user = await User.findById(userID);
    const emergencyFund = await EmergencyFund.find({userID: userID});

    await EmergencyFund.findByIdAndDelete(id).then(()=>{
        res.redirect("/emergency");
    }).catch((err)=>{
        console.log(err);
        res.render("emergency.ejs", {error: 'Failed to delete', user, emergencyFund})
    })
})

module.exports = router;