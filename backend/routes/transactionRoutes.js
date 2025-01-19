const express = require('express');
const Transaction = require('../models/Transaction');
const router = express.Router();

// Create a new transaction
router.post('/', async (req, res) => {
  try {
    const { amount, type, date, account, category, subcategory, notes } = req.body;

    console.log('Received transaction data:', req.body); // Debugging

    // Validate required fields
    if (!amount || !type || !account || !category) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create a new transaction
    const transaction = new Transaction({
      amount,
      type,
      date: date || Date.now(),
      account,
      category,
      subcategory,
      notes,
    });

    console.log('Saving transaction to database:', transaction); // Debugging

    // Save the transaction to the database
    await transaction.save();

    console.log('Transaction saved successfully:', transaction); // Debugging

    // Return the saved transaction
    res.status(201).json(transaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch all transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find();
    console.log('Fetched transactions:', transactions); // Debugging
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;