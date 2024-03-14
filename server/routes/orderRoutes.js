// server/routes/orderRoutes.js
const express = require('express');
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all orders for a unique link
router.get('/table/:uniqueLink', auth, async (req, res) => {
  try {
    console.log("populating ddashboard table with:", req);
    const orders = await Order.find({ uniqueLink: req.params.uniqueLink });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// Endpoint to handle order submission
router.post('/submit', async (req, res) => {
  try {
    const { customerName, address, phoneNumber, email, paymentAmount, orderSpecification, uniqueLink } = req.body;

    console.log("Received order submission:", req.body);

    const newOrder = new Order({
      customerName,
      address,
      phoneNumber,
      email,
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
// router.post('/submit', async (req, res) => {
//   console.log("submitting order:", req)
// });


// Update an order with a tracking number
router.patch('/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.trackingNumber = req.body.trackingNumber || order.trackingNumber;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
