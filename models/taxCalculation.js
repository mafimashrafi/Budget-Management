const mongoose = require('mongoose');

const taxProfileSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  income: Number,
  goldValue: Number,
  propertyValue: Number,
  savings: Number,
  otherAssets: Number,
  region: String,
  freedomFighter: {type: Boolean, default: false},
  age: {type: Boolean, default: false},
  special: {type: Boolean, default: false},
  specialChild: {type: Boolean, default: false},
  gender: String,
  totalWealth: Number,
  calculatedTax: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TaxProfile', taxProfileSchema);
