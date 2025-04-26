const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const { Schema } = mongoose;
const verifyUser = require("../middlewares/authMiddleware.js");
const SavingsGoal = require("../models/savingGoals.js");


router.get("/savingsGoal", verifyUser, async(req, res)=>{
    const userID = req.userID;
    const user = await User.findById(userID);
    const savings = await SavingsGoal.find({userID: userID});
    res.render("savingsGoal.ejs", {error: null, user, savings, currentPage: 'savingsGoal'});
});

//creat goals
router.post("/savingsGoal/:id/add", verifyUser, async(req, res)=>{
    const userID = req.userID;
    const {id} = req.params;
    const {savingSource, goal, estimatedSave, savedAmount, targetMonth, done} = req.body;

    const newSavingsGoal = new SavingsGoal({
        userID: userID,
        savingSource: savingSource,
        goals: goal,
        estimatedSave: estimatedSave,
        savedAmount: savedAmount,
        targetMonth: targetMonth,
        done: done,
    });

    newSavingsGoal.save().then(()=>{
        console.log("savings created");
        res.redirect("/savingsGoal");
    }).catch((err)=>{
        console.log(err);
        res.render("savingsGoal.ejs", {error: "Failed to add", user, savings, currentPage: 'savingsGoal'});
    });
});

//editing route
router.get("/savingsGoal/:id/edit", verifyUser, async(req, res)=>{
    const {id} = req.params;
    const save = await SavingsGoal.findById(id);
    res.render("editSavingsGoal.ejs", {error: null, save});
});

router.post("/savingsGoal/:id/edit", verifyUser, async(req, res)=>{
    const {id} = req.params;
    const {savingSource, goal, estimatedSave, savedAmount, targetMonth, done} = req.body;
    const save = await SavingsGoal.findById(id);
    
    let updateGoal = await SavingsGoal.findByIdAndUpdate(id, {
        savingSource: savingSource,
        goals: goal,
        estimatedSave: estimatedSave,
        savedAmount: savedAmount,
        targetMonth: targetMonth,
        done: done,
    }).then(()=>{
        // console.log("updated");
        res.redirect("/savingsGoal");
    }).catch((err)=>{
        console.log(err);
        res.render("savingsGoal.ejs", {error: "Failed to update", save, currentPage: 'savingsGoal'});
    });
});

//delete route
router.get("/savingsGoal/:id/delete", verifyUser, async(req, res)=>{
    const {id} = req.params;

    SavingsGoal.findByIdAndDelete(id).then(()=>{
        res.redirect("/savingsGoal.ejs");
    }).catch((err)=>{
        console.log(err);
        res.render("savingsGoal.ejs", {error: "Failed to delete", save, currentPage: 'savingsGoal'})
    })
});

module.exports = router;