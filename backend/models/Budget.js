const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  period: { type: String, enum: ['monthly', 'weekly'], required: true }
});

module.exports = mongoose.model('Budget', budgetSchema);