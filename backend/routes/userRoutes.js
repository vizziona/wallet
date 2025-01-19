const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
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

    // Check if a user already exists
    let user = await User.findOne();
    if (user && user.pinSet) {
      return res.status(400).json({ 
        message: 'PIN already set. Cannot create multiple users.' 
      });
    }

    // Hashing the PIN
    const hashedPin = await bcrypt.hash(pin, 10);

    if (user) {
      // Update existing user
      user.name = name.trim();
      user.pin = hashedPin;
      user.pinSet = true;
      user.updatedAt = Date.now();
    } else {
      // Create new user
      user = new User({
        name: name.trim(),
        pin: hashedPin,
        pinSet: true
      });
    }

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

    // Find user by name (case-insensitive)
    const user = await User.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid Name or PIN' });
    }

    // Verify PIN
    const isMatch = await bcrypt.compare(pin, user.pin);
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
router.get('/check-pin-status', async (req, res) => {
  try {
    const user = await User.findOne();
    res.status(200).json({ pinSet: !!(user && user.pinSet) });
  } catch (error) {
    console.error('Error checking PIN status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;