const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); 
const User = require('../models/User');

// Set PIN (only allowed once)
router.post('/set-pin', async (req, res) => {
  try {
    const { name, pin } = req.body;

    // Validating input
    if (!name || !pin) {
      return res.status(400).json({ message: 'Name and PIN are required' });
    }
    if (pin.length !== 5) {
      return res.status(400).json({ message: 'PIN must be exactly 5 digits' });
    }

    // Hashing the PIN
    const hashedPin = await bcrypt.hash(pin, 10); 

    // Create new user
    const user = new User({
      name: name.trim(),
      pin: hashedPin,
      pinSet: true
    });

    await user.save();
    res.status(201).json({ 
      message: 'Name and PIN set successfully',
      user: { name: user.name, pinSet: user.pinSet }
    });
  } catch (error) {
    console.error('Error setting Name and PIN:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify PIN
router.post('/verify-pin', async (req, res) => {
  try {
    const { name, pin } = req.body;

    if (!name || !pin) {
      return res.status(400).json({ message: 'Name and PIN are required' });
    }

    // Find all users with the same name (case-insensitive)
    const users = await User.find({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
    });

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid Name or PIN' });
    }

    // Check if any user matches the PIN
    let isMatch = false;
    for (const user of users) {
      isMatch = await bcrypt.compare(pin, user.pin);
      if (isMatch) {
        break;
      }
    }

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid Name or PIN' });
    }

    res.status(200).json({ message: 'Name and PIN verified successfully' });
  } catch (error) {
    console.error('Error verifying Name and PIN:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Check if PIN is set
router.get('/check-pin-status/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const users = await User.find({ name: name.trim() });
    res.status(200).json({ pinSet: users.length > 0 });
  } catch (error) {
    console.error('Error checking PIN status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;