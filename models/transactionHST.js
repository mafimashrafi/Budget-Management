const mongoose = require("mongoose");

const TransactionHSTSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }, // Add userId field
  year: { type: Number, required: true },
  month: { type: Number, required: true },
  total: { type: Number, required: true }
});

module.exports = mongoose.model("TransactionHST", TransactionHSTSchema);