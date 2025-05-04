const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const verifyUser = require("../middlewares/authMiddleware.js");
const Report = require("../models/report.js");

router.get("/report", verifyUser, async (req, res)=>{
    const report = await Report.find();
    res.render("report.ejs", {report, error: null});
});

router.post("/report/create", verifyUser, async(req, res)=>{
    const {postrep} = req.body;
    const id = req.params;
    const report = await Report.find();
   

    const newReport = await Report({
        report: postrep,
        date: new Date(),
    });

    await newReport.save().then(()=>{
        res.redirect("/report");
    }).catch((err)=>{
        res.render("report.ejs", {report, error: "Failed to Post"});
    })
});

module.exports = router;