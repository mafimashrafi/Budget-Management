const mongoose = require("mongoose");
const express = require('express');
const router = express.Router();
const Reminder = require('../models/billreminders');
const verifyUser = require('../middlewares/authMiddleware');
const User = require("../models/user.js");

router.get('/billReminder', verifyUser, async (req, res) => {
  const userID= req.userID;
  const user = await User.findById(userID);
  const reminders = await Reminder.find({userID: userID});
  res.render('billReminder.ejs', {error: null, user, reminders, currentPage: 'billReminder'});
});

router.post("/reminders/:id/add", verifyUser, async (req, res)=>{
  const {id} = req.params;
  const {billToRemind, reminderDate} = req.body;
  const user = await User.findById(id);
  const reminders = await Reminder.find({userID: id});
  const email = user.email; 

  let formatedDate;
  if (reminderDate && reminderDate.trim() !== "") {
      const [day, month, year] = reminderDate.split(/[- /|:;,]/).map(Number);
      formatedDate = new Date(year, month - 1, day);
  
      if (isNaN(formatedDate.getTime())) {
          formatedDate = new Date(); 
      }
  } else {
      formatedDate = new Date();
  }

  const newReminder = await Reminder({
    userID: id,
    email: email,
    billToRemind: billToRemind,
    reminderDate: formatedDate,
  });

  await newReminder.save().then(()=>{
    res.redirect("/billReminder");
  }).catch((err)=>{
    console.log(err);
    res.render('billReminder.ejs', {error: "Failed to add", user, reminders, currentPage: 'billReminder'});
  });
});

router.get("/reminders/:id/delete", verifyUser, async (req, res)=>{
  const {id} = req.params;
  const userID= req.userID;
  const user = await User.findById(userID);
  const reminders = await Reminder.find({userID: userID});

  await Reminder.findByIdAndDelete(id).then(()=>{
    res.redirect("/billReminder");
  }).catch((err)=>{
    console.log(err);
    res.render('billReminder.ejs', {error: "Failed to delete", user, reminders, currentPage: 'billReminder'});
  });

});

module.exports = router;
