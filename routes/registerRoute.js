const express = require("express"); 
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/user.js");
const validator = require("validator");
const sendVerificationEmail = require("../utils/sendEmail.js");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(express.static("public"));
router.use(require("method-override")("_method"));

router.get("/register", (req, res) => {
    res.render("register.ejs", {error: null});
});

router.post("/register", async (req, res) =>{
    const {username, email, password, confirmPassword, phoneNumber} = req.body;

    if(!validator.isEmail(email)){
        return res.render("register.ejs", {error: "Invalid email formate"});
    }

    if(password !== confirmPassword){
        return res.render("register.ejs", {error: "Password do not match", username, email, phoneNumber})
    };

    const existingUser = await User.findOne({email});
    if(existingUser){
        return res.render("register.ejs", {error: "Email already exists", username, email, phoneNumber})
    }

    const existingNumber = await User.findOne({phoneNumber});
    if(existingNumber){
        return res.render("register.ejs", {error: "Phone Number already exists", username, email, phoneNumber})
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

    const vtoken = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    await sendVerificationEmail(newUser.email, vtoken);
});

router.get("/verify-email", async (req, res) => {
    const { vtoken } = req.query;
    try {
      const decoded = jwt.verify(vtoken, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.render("register.ejs", {error: "User not found"});
      };

      user.isVerified = true;
      await user.save();
  
    } catch (err) {
      res.status(400).send("Invalid or expired token");
    }
  });

module.exports = router;