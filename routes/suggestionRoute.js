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
    res.render("suggestions.ejs");
});
module.exports = router;