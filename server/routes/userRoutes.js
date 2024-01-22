// server/routes/userRoutes.js
const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();
const Order = require('../models/Order');


router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const customer = new Customer({
    name: req.body.name,
    address: req.body.address,
    email: req.body.email,
    // Add other fields as necessary
  });

  try {
    const newCustomer = await customer.save();
    res.status(201).json(newCustomer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Endpoint to handle order submission
router.post('/submit', async (req, res) => {
  try {
    const { customerName, address, paymentAmount, orderSpecification, uniqueLink } = req.body;

    console.log("Received order submission:", req.body);

    const newOrder = new Order({
      customerName,
      address,
      paymentAmount,
      orderSpecification,
      uniqueLink: uniqueLink, // Assign the unique link from the URL
    });

    const savedOrder = await newOrder.save();

    console.log("Order saved successfully:", savedOrder);

    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("Error saving order:", err);
    res.status(500).json({ message: err.message });
  }
});

router.get('/details', auth, async (req, res) => {
  try {
    console.log("User ID:", req.user.id);
    const user = await User.findById(req.user.id);
    if (!user) {
      console.error('User not found with ID:', req.user.id);
      return res.status(404).send('User not found');
    }
    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      uniqueLink: user.uniqueLink
    });
  } catch (err) {
    console.error('Error in /details:', err);
    res.status(500).send('Server error');
  }
});

// Add more routes as necessary

module.exports = router;
