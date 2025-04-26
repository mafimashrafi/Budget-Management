const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const verifyUser = require("../middlewares/authMiddleware.js");
const IncomeCategory = require("../models/incomeCategory.js");

router.get("/incomeCategory", verifyUser, async(req, res)=>{
    const userID = req.userID;
    const user = await User.findById(userID)
    const incomeCatagory = await IncomeCategory.find({userID: userID});
    res.render("incomeCategory.ejs", {error: null, user, incomeCatagory, currentPage: 'incomeCategory'});
});

router.post("/incomeCategory/:id/add", verifyUser, async(req, res)=>{
    const {id} = req.params;
    const {category, earning, inputmonth, inputDate} = req.body;
    const user = await User.findById(id);
    const incomeCatagory = await IncomeCategory.find({userID: id});

    const [day, month, year] = inputDate.split(/[ -/:;]/).map(Number);
    const formatedDate = new Date(year, month - 1, day);

    const newIncome = new IncomeCategory({
        userID: id,
        category: category,
        earning: earning,
        month: inputmonth,
        date: formatedDate,
    });

    await newIncome.save().then(()=>{
        res.redirect("/incomeCategory");
    }).catch((err)=>{
        console.log(err);
        res.render("incomeCategory.ejs", {error: 'Failed to add', user, incomeCatagory, currentPage: 'incomeCategory'})
    });
});

router.get("/incomeCategory/:id/delete", verifyUser, async (req, res)=>{
    const {id} = req.params;
    const userID = req.userID;
    const user = await User.findById(userID);
    const incomeCatagory = await IncomeCategory.find({userID: userID});

    await IncomeCategory.findByIdAndDelete(id).then(()=>{
        res.redirect("/incomeCategory");
    }).catch((err)=>{
        console.log(err);
        res.render("incomeCategory.ejs", {error: 'Failed to delete', user, incomeCatagory, currentPage: 'incomeCategory'})
    });
});

module.exports = router;