// server/routes/userRoutes.js
const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();
const Order = require('../models/Order');
require('dotenv').config();
const twilio_client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const nodemailer = require('nodemailer');



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
router.post('/send-email', (req, res) => {
  const { to, body } = req.body;

  // Create reusable transporter object using SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail', // For example, using Gmail. You can use another service
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // Your email password
    },
  });

  // Setup email data
  let mailOptions = {
    from: process.env.EMAIL_USER, // sender address
    to: to, // list of receivers
    subject: 'Order Update', // Subject line
    text: body, // plain text body
    // html: "<b>Hello world?</b>", // You can also use HTML body
  };

  // Send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send({ error: 'Failed to send email' });
    } else {
      console.log('Email sent: ' + info.response);
      res.send({ message: 'Email sent!', id: info.messageId });
    }
  });
});

module.exports = router;
