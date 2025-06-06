const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const verifyUser = require("../middlewares/authMiddleware.js");
const Transaction = require("../models/transaction.js");

router.get("/transaction", verifyUser, async (req, res)=>{
    const userID= req.userID;
    const user = await User.findById(userID);

    const selectedMonth = parseInt(req.query.month) || (new Date().getMonth() + 1);

    const transactions = await Transaction.find({
        userID: userID,
        date: {
            $gte: new Date(new Date().getFullYear(), selectedMonth - 1, 1),
            $lt: new Date(new Date().getFullYear(), selectedMonth, 1),
        },
    });

    res.render("transaction.ejs", { error: null, user, transactions, selectedMonth ,currentPage: 'transaction' });
});

router.post("/transaction/:id/add", verifyUser, async (req, res)=>{
    const {id} = req.params;
    const user = await User.findById(id);
    const transactions = await Transaction.find({userID: id});
    const {date, note, explainSpends, amount} = req.body;

    let formatedDate;
    if (date && date.trim() !== "") {
        const [day, month, year] = date.split(/[- /|:;,]/).map(Number);
        formatedDate = new Date(year, month - 1, day);
    
        if (isNaN(formatedDate.getTime())) {
            formatedDate = new Date(); 
        }
    } else {
        formatedDate = new Date();
    }

    const newTransaction = await Transaction({
        userID: id,
        date: formatedDate,
        note: note,
        explainSpends: explainSpends,
        amount: amount,
    });

    await newTransaction.save().then(()=>{
        res.redirect("/transaction");
    }).catch((err)=>{
        console.log(err);
        res.render("transaction.ejs", {error: "Failed to add", user, transactions, currentPage: 'transaction'})
    });
});

router.get("/transaction/:id/delete", verifyUser, async (req, res)=>{
    const userID= req.userID;
    const user = await User.findById(userID);
    const transactions = await Transaction.find({userID: userID});

    const {id} = req.params;

    await Transaction.findByIdAndDelete(id).then(()=>{
        res.redirect("/transaction");
    }).catch((err)=>{
        console.log(err);
        res.render("transaction.ejs", {error: "Failed to add", user, transactions, currentPage: 'transaction'})
    });
});

module.exports = router;