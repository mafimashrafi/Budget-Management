const express = require("express"); 
const mongoose = require("mongoose");
const path = require("path");
const bcrypt = require("bcrypt");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const User = require("../models/user.js");
const jwt = require('jsonwebtoken');
require("dotenv").config();

const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(express.static("public"));
router.use(require("method-override")("_method"));

router.get("/login", (req, res) => {    
    res.render("login.ejs", {error: null});
}); 

router.post("/login", async (req, res) =>{
    const {username, password, email, phoneNumber} = req.body;
    
    const existingUser = await User.findOne({email, phoneNumber});
    if(!existingUser){
        return res.render("login.ejs", {error: "User is not registered"});
    };

    const matchPassword = await bcrypt.compare(password, existingUser.password);
    if(!matchPassword){
        return res.render("login.ejs", {error: "wrong password"});
    };

    const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', token, { 
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'strict'
     });
    res.redirect('/home');

});


// Logout
router.post('/logout', (req, res) => {
    // res.clearCookie('token');
    res.cookie('token', { 
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: new Date(0),
        sameSite: 'strict'
     });
    res.redirect('/');
  });

module.exports = router;