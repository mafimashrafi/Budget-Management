const express = require('express');
const router = express.Router();
const TaxProfile = require('../models/taxCalculation.js');
const verifyUser = require('../middlewares/authMiddleware.js');
const User = require('../models/user.js');

router.get("/taxCalculation", verifyUser, async (req, res)=>{
    const userID = req.userID;
    const user = await User.findById(userID);
    const taxProfile = await TaxProfile.find({userID: userID});
    res.render("taxCalculation.ejs", {error: null, user, taxProfile, currentPage: 'taxCalculation'});
});

router.post('/taxCalculation/:id/calculate', verifyUser, async (req, res) => {
  const {id} = req.params;
  const user = await User.findById(id);
  const taxProfile = await TaxProfile.find({userID: id});
  const { income, goldValue, propertyValue, savings, otherAssets, region, freedomFighter, age, special, specialChild, gender } = req.body;

  const { totalWealth, tax } = calculateTax(
    income,
    goldValue,
    propertyValue,
    savings,
    otherAssets,
    region,
    freedomFighter,
    age,
    special,
    specialChild,
    gender,
  );

  function calculateTax(income, gold, property, savings, otherAssets, region, freedomFighter, age, special, specialChild, gender) {
    income = Number(income) || 0;
    gold = Number(gold) || 0;
    property = Number(property) || 0;
    savings = Number(savings) || 0;
    otherAssets = Number(otherAssets) || 0;

    const totalWealth = gold + property + savings + otherAssets;
    let tax = 0;

    if (gender == 'Female' || age == true) {
        if (income <= 450000) tax += 0;
        else if (income <= 550000) tax += (income - 450000) * 0.05;
        else if (income <= 950000) tax += ((income - 550000) * 0.10) + ((550000 - 450000) * 0.05);
        else if (income <= 1450000) tax += ((income - 950000) * 0.15) + ((950000 - 550000) * 0.10) + ((550000 - 450000) * 0.05);
        else if (income <= 1950000) tax += ((income - 1450000) * 0.20) + ((1450000 - 950000) * 0.15) + ((950000 - 550000) * 0.10) + ((550000 - 450000) * 0.05);
        else tax += ((income - 1950000) * 0.25) + ((1950000 - 1450000) * 0.20) + ((1450000 - 950000) * 0.15) + ((950000 - 550000) * 0.10) + ((550000 - 450000) * 0.05);
    } else if (gender == "Third-Gender" || special == true) {
        if (income <= 475000) tax += 0;
        else if (income <= 575000) tax += (income - 475000) * 0.05;
        else if (income <= 975000) tax += ((income - 575000) * 0.10) + ((575000 - 475000) * 0.05);
        else if (income <= 1475000) tax += ((income - 975000) * 0.15) + ((975000 - 575000) * 0.10) + ((575000 - 475000) * 0.05);
        else if (income <= 1975000) tax += ((income - 1475000) * 0.20) + ((1475000 - 975000) * 0.15) + ((975000 - 575000) * 0.10) + ((575000 - 475000) * 0.05);
        else tax += ((income - 1975000) * 0.25) + ((1975000 - 1475000) * 0.20) + ((1475000 - 975000) * 0.15) + ((975000 - 575000) * 0.10) + ((575000 - 475000) * 0.05);
    } else if (freedomFighter == true) {
        if (income <= 500000) tax += 0;
        else if (income <= 600000) tax += (income - 500000) * 0.05;
        else if (income <= 900000) tax += ((income - 600000) * 0.10) + ((600000 - 500000) * 0.05);
        else if (income <= 1500000) tax += ((income - 900000) * 0.15) + ((900000 - 600000) * 0.10) + ((600000 - 500000) * 0.05);
        else if (income <= 2000000) tax += ((income - 1500000) * 0.20) + ((1500000 - 900000) * 0.15) + ((900000 - 600000) * 0.10) + ((600000 - 500000) * 0.05);
        else tax += ((income - 2000000) * 0.25) + ((2000000 - 1500000) * 0.20) + ((1500000 - 900000) * 0.15) + ((900000 - 600000) * 0.10) + ((600000 - 500000) * 0.05);
    } else if (specialChild == true) {
        if (income <= 400000) tax += 0;
        else if (income <= 500000) tax += (income - 400000) * 0.05;
        else if (income <= 900000) tax += ((income - 500000) * 0.10) + ((500000 - 400000) * 0.05);
        else if (income <= 1400000) tax += ((income - 900000) * 0.15) + ((900000 - 500000) * 0.10) + ((500000 - 400000) * 0.05);
        else if (income <= 1900000) tax += ((income - 1400000) * 0.20) + ((1400000 - 900000) * 0.15) + ((900000 - 500000) * 0.10) + ((500000 - 400000) * 0.05);
        else tax += ((income - 1900000) * 0.25) + ((1900000 - 1400000) * 0.20) + ((1400000 - 900000) * 0.15) + ((900000 - 500000) * 0.10) + ((500000 - 400000) * 0.05);
    } else if (gender == "Male") {
        if (income <= 350000) tax += 0;
        else if (income <= 450000) tax += (income - 350000) * 0.05;
        else if (income <= 850000) tax += ((income - 450000) * 0.10) + ((450000 - 350000) * 0.05);
        else if (income <= 1350000) tax += ((income - 850000) * 0.15) + ((850000 - 450000) * 0.10) + ((450000 - 350000) * 0.05);
        else if (income <= 1850000) tax += ((income - 1350000) * 0.20) + ((1350000 - 850000) * 0.15) + ((850000 - 450000) * 0.10) + ((450000 - 350000) * 0.05);
        else tax += ((income - 1850000) * 0.25) + ((1850000 - 1350000) * 0.20) + ((1350000 - 850000) * 0.15) + ((850000 - 450000) * 0.10) + ((450000 - 350000) * 0.05);
    }

    if (region == "Dhaka/Chattagram" && tax < 5000) tax = 5000;
    else if (region == "City-Corporation" && tax < 4000) tax = 4000;
    else if (region == "Non City Corporation" && tax < 3000) tax = 3000;

    return { totalWealth, tax };
}
  

  const newtaxProfile = new TaxProfile({
    userID: id, 
    income,
    goldValue,
    propertyValue,
    savings,
    otherAssets,
    region,
    freedomFighter,
    age,
    special,
    specialChild,
    gender,
    totalWealth,
    calculatedTax: tax
  });

  await newtaxProfile.save().then(()=>{
    res.redirect("/taxCalculation");
  }).catch((err)=>{
    console.log(err);
    res.render('taxCalculation.ejs', {error: "internal error", user, taxProfile, currentPage: 'taxCalculation'});
  });
});

module.exports = router;
