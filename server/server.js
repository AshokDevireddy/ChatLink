require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const path = require('path'); // Add this line
// require('./passport-setup');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');


const app = express();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000', // URL of your React frontend application
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'] // Allow specific headers
}));

app.use(session({
    secret: 'your_session_secret',
    resave: false,
    saveUninitialized: false,
}));




// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/../client/build'))); // Adjust if your build folder differs

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/order', orderRoutes);

app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  console.log("Headers:", req.headers);
  next();
});

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/../client/build/index.html'));
});

app.listen(process.env.PORT || 5001, () => {
  console.log(`Server is running on port: ${process.env.PORT || 5001}`);
});
