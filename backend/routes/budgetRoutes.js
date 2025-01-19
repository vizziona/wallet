const express = require('express');
const Budget = require('../models/Budget');
const router = express.Router();

// Set or update budget
router.post('/', async (req, res) => {
  let budget = await Budget.findOne();
  if (budget) {
    budget.amount = req.body.amount;
    budget.period = req.body.period;
  } else {
    budget = new Budget(req.body);
  }
  await budget.save();
  res.status(201).send(budget);
});

// Fetch current budget
router.get('/', async (req, res) => {
  const budget = await Budget.findOne();
  res.send(budget);
});

module.exports = router;