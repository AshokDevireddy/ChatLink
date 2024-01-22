const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { v4: uuidv4 } = require('uuid'); // At the top of your file


const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_OAUTH_CALLBACK_URL
);

router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create new user
      user = new User({
        email,
        password: hashedPassword
        // Add other necessary fields
      });

      await user.save();

      // Create token (JWT)
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.status(201).json({ token });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});


// Google Auth
router.get('/google', async (req, res) => {
  const url = client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
  });
  res.redirect(url);
});

router.get('/google/redirect', async (req, res) => {
  const { tokens } = await client.getToken(req.query.code);
  client.setCredentials(tokens);

  const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  let user = await User.findOne({ email: payload.email });

  if (!user) {
    user = new User({
      email: payload.email,
      googleId: payload.sub,
      firstName: payload.given_name, // Assuming these fields are in the payload
      lastName: payload.family_name,
      uniqueLink: uuidv4(),
    });
    await user.save();
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  console.log("in redirects", token)
  res.redirect(`http://localhost:3000/dashboard?token=${token}`);
});

module.exports = router;
