const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const { Schema } = mongoose;
const verifyUser = require("../middlewares/authMiddleware.js");
const ExpenseCategory = require("../models/expenseCatagory.js");

router.get("/expenseCategory", verifyUser, async(req, res)=>{
    const userID = req.userID;
    const user = await User.findById(userID)
    const expenseCatagory = await ExpenseCategory.find({userID: userID});
    res.render("expenseCategory.ejs", {error: null, user, expenseCatagory});
});

router.post("/expenseCategory/:id/add", verifyUser, async(req, res)=>{
    const {id} = req.params;
    const {category, cost, inputmonth, inputDate} = req.body;
    const user = await User.findById(id);
    const expenseCatagory = await ExpenseCategory.find({userID: id});

    const [day, month, year] = inputDate.split(/[ -/:;]/).map(Number);
    const formatedDate = new Date(year, month - 1, day);

    const newExpense = new ExpenseCategory({
        userID: id,
        category: category,
        cost: cost,
        month: inputmonth,
        date: formatedDate,
    });

    await newExpense.save().then(()=>{
        res.redirect("/expenseCategory");
    }).catch((err)=>{
        console.log(err);
        res.render("expenseCategory.ejs", {error: 'Failed to add', user, expenseCatagory})
    });
});

router.get("/expenseCategory/:id/delete", verifyUser, async (req, res)=>{
    const {id} = req.params;
    const userID = req.userID;
    const user = await User.findById(userID);
    const expenseCatagory = await ExpenseCategory.find({userID: userID});

    await ExpenseCategory.findByIdAndDelete(id).then(()=>{
        res.redirect("/expenseCategory");
    }).catch((err)=>{
        console.log(err);
        res.render("expenseCategory.ejs", {error: 'Failed to delete', user, expenseCatagory})
    });
});

module.exports = router;