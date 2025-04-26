const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const axios = require('axios');
const verifyUser = require("../middlewares/authMiddleware.js");

const API_KEY = process.env.API_KEY;

router.get("/multicurrency", verifyUser, (req, res) =>{
    res.render("multiCurrency.ejs", {result: null, currentPage: 'multicurrency'});
});

router.post("/multicurrency/convert", async (req, res) => {
    const { from, to, amount } = req.body;
  
    try {
      const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${from}/${to}/${amount}`;
      const response = await axios.get(url);
      const result = response.data.conversion_result;
  
      res.render("multiCurrency.ejs", {
        result: `${amount} ${from} = ${result} ${to}`
      });
    } catch (err) {
      console.error(err);
      res.render("multiCurrency.ejs", { result: 'Error fetching conversion rate.', currentPage: 'multicurrency' });
    }
  });
  
  module.exports = router;