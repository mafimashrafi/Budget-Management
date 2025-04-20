const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const Suggestion = require("../models/suggestion.js");
const { Schema } = mongoose;
const verfyUser = require("../middlewares/authMiddleware.js");

router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(express.static("public"));

router.get("/suggestions", verfyUser, async (req, res)=>{
    const userID = req.userID;
    const user = await User.findById(userID);
    const suggestion = await Suggestion.find({})
    res.render("suggestions.ejs", {user, suggestion});
});

router.post("/suggestions/:id/create", verfyUser, async (req, res)=>{
    const {id} = req.params;
    const user = await User.findById(id);
    const {postsgs} = req.body;

    const postBy = user.name;
    const newSuggestion = new Suggestion({
        post: postsgs,
        postDate: new Date(),
        postBy: postBy,
    });

    newSuggestion.save().then(()=>{
        console.log("suggestion created");
        res.redirect("/suggestions");
    }).catch((err)=>{
        console.log(err);
        res.render("suggestions.ejs", {error: "Please keep it under 200 characters", user});
    })
});
module.exports = router;