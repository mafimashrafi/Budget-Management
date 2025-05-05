const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const verifyUser = require("../middlewares/authMiddleware.js");
const Transaction = require("../models/transaction.js");
const RecurringTransaction = require("../models/recurringTransaction.js");
const TransactionHST = require("../models/transactionHST.js");

router.get("/transaction-history", verifyUser, async (req, res)=>{
    const userID = req.userID;

    const transAgg = await Transaction.aggregate([
        {
        $group: {
            _id: {
            userID: "$userID",
            year: { $year: "$date" },
            month: { $month: "$date" }
            },
            totalAmount: { $sum: "$amount" }
        }
        }
    ]);

    const recurringAgg = await RecurringTransaction.aggregate([
        {
        $group: {
            _id: {
            userID: "$userID",
            year: { $year: "$date" },
            month: { $month: "$date" }
            },
            totalAmount: { $sum: "$amount" }
        }
        }
    ]);

    const totalsMap = new Map();

    for (const item of [...transAgg, ...recurringAgg]) {
      const key = `${item._id.userID}-${item._id.year}-${item._id.month}`;
      if (!totalsMap.has(key)) {
        totalsMap.set(key, {
          userID: item._id.userID,
          year: item._id.year,
          month: item._id.month,
          total: 0
        });
      }
      totalsMap.get(key).total += item.totalAmount;
    }

    for (const value of totalsMap.values()) {
        await TransactionHST.findOneAndUpdate(
          {
            userID: value.userID,
            year: value.year,
            month: value.month
          },
          { $set: { total: value.total } },
          { upsert: true, new: true }
        );
      }
    
    try{
      const histories = await TransactionHST.find({userID: userID}); 
      res.render("transactionHST.ejs", {histories, currentPage: 'transaction-history'});
    }catch(error){
      console.error("Something went wrong:", error.message);
      res.redirect("/dashbord");
    }

});

module.exports = router;