const express = require('express');
const Category = require('../models/Category');
const router = express.Router();

// Add a new category
router.post('/', async (req, res) => {
  const category = new Category(req.body);
  await category.save();
  res.status(201).send(category);
});

// Fetch all categories
router.get('/', async (req, res) => {
  const categories = await Category.find();
  res.send(categories);
});

module.exports = router;