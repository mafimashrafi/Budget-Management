const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const { Schema } = mongoose;
const verfyUser = require("../middlewares/authMiddleware.js");
const bcrypt = require("bcrypt");

router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(express.static("public"));


router.get("/userProfile", verfyUser, async (req, res) => {
    const userID = req.userID;

    try{
        const user = await User.findById(userID);
        if(!user){
            return res.status(404).send('User not found');
        }
        res.render("userProfile.ejs", {user});
    }catch(err){
        console.log("Error fetching user:" ,err.message);
        res.status(404).send("Internal Server Error");
    }
});

router.get("/delete/:id", async (req, res)=>{
    const{id} = req.params;
    const user = await User.findById(id);
    res.render("delete.ejs", {user});
});

router.delete("/delete/:id", async (req, res)=>{
    const {email, password} = req.body;
    const {id} = req.params;

    const existingUser = await User.findById(id);
    if(email != existingUser.email){
        return res.render("delete.ejs", {error: "Wrong email"});
    }

    const matchPassword = await bcrypt.compare(password, existingUser.password);
    if(!matchPassword){
        return res.render("delete.ejs", {error: "Worng Password"});
    }

    try{
        await User.findByIdAndDelete(id);
        res.redirect("/");
    }catch(err){
        console.log(err);
        res.render("delete.ejs", {error: "Deletein failed"});
    }
});

module.exports = router;