const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const verifyUser = require("../middlewares/authMiddleware.js");
const BudgetList = require("../models/budget.js");

router.get("/budget", verifyUser, async(req, res)=>{
    const userID = req.userID;
    const user = await User.findById(userID);
    const budgetList = await BudgetList.find({userId: userID});
    // console.log(budgetList);
    res.render("budget.ejs", {user, budgetList, error:null, currentPage: 'budget'});
});

//creat budget
router.post("/budget/:id/add", verifyUser, async(req, res)=>{
    const {id} = req.params;
    const {todo, budget} = req.body;
    const user = await User.findById(id);
    
    const newBudget = new BudgetList({
        userId: id,
        todo: todo,
        budget: budget,
    });

    newBudget.save().then(()=>{
        res.redirect("/budget");
    }).catch((err)=>{
        console.log(err);
        res.render("budget.ejs", {error: "Failed to add budget", user, currentPage: 'budget'});
    })
});

//delete route
router.delete("/budget/:id/delete", verifyUser, async(req, res)=>{
    const {id} = req.params;
    await BudgetList.findByIdAndDelete(id).then(()=>{
        res.redirect("/budget");
    }).catch((err)=>{
        res.render("budget.ejs", {error: "Failed to delete", currentPage: 'budget'});
    })

});

module.exports = router;