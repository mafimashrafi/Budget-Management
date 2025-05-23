const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const { Schema } = mongoose;
const verifyUser = require("../middlewares/authMiddleware.js");
const Subscription = require("../models/subscription.js");

router.get("/subscriptions", verifyUser, async(req, res)=>{
    const userID = req.userID;
    const user = await User.findById(userID);
    const subscription = await Subscription.find({userID: userID});
    res.render("subscriptions.ejs", {error: null, user, subscription, currentPage: 'subscriptions'});
});

router.post("/subscriptions/:id/add", verifyUser, async(req, res)=>{
    const userID = req.userID;
    const user = await User.findById(userID);
    const {id} = req.params;
    const {subscriptionName, subscriptionType, subscriptionFee, startingDate} = req.body;

    const [day, month, year] = startingDate.split('-').map(Number);
    const formatedDate = new Date(year, month - 1, day);

    const subscription = await Subscription({
        userID: id,
        subscriptionName: subscriptionName,
        subscriptionType: subscriptionType,
        subscriptionFee: subscriptionFee,
        startingDate : formatedDate,
    });

    subscription.save().then(()=>{
        res.redirect("/subscriptions");
    }).catch((err)=>{
        console.log(err);
        res.render("subscriptions.ejs", {error: 'Failed to add', user, subscription, currentPage: 'subscriptions'})
    })
});

//delete route
router.get("/subscription/:id/delete", verifyUser, async (req, res)=>{
    const {id} = req.params;
    const userID = req.userID;
    const user = await User.findById(userID);
    const subscription = await Subscription.findById(id);
    await Subscription.findByIdAndDelete(id).then(()=>{
        res.redirect("/subscriptions");
    }).catch((err)=>{
        res.render("subscriptions.ejs", {error: 'Failed to add', user, subscription, currentPage: 'subscriptions'});
    });
});

module.exports = router;