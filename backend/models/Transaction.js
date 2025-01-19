const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  date: { type: Date, default: Date.now },
  account: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String },
  notes: { type: String }
});

module.exports = mongoose.model('Transaction', transactionSchema);