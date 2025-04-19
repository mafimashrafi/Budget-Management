const express = require("express"); 
const mongoose = require("mongoose");
const path = require("path");
const bcrypt = require("bcrypt");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const User = require("../models/user.js");

const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(express.static("public"));
router.use(require("method-override")("_method"));

router.get("/register", (req, res) => {
    res.render("register.ejs", {error: null});
});

router.post("/register", async (req, res) =>{
    const {username, email, password, confirmPassword, phoneNumber} = req.body;
    // console.log(password, req.body.confirmPassword);

    if(password !== confirmPassword){
        return res.render("register.ejs", {error: "Password do not match", username, email, phoneNumber})
    };

    const existingUser = await User.findOne({email});
    if(existingUser){
        return res.render("register.ejs", {error: "Email already exists", username, email, phoneNumber})
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        name: username,
        email: email,
        password: hashPassword,
        phoneNumber: phoneNumber,
        createdAt:new Date(),
    });
    newUser.save().then(() =>{
        console.log("user created successfully");
        res.redirect("/login");
    }).catch((err)=>{
        console.log(err);
        res.render("register.ejs", {error: "Error creating user", username, email, phoneNumber});
    });
});

module.exports = router;