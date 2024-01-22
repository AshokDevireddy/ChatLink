const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');


const userSchema = new mongoose.Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: function() {
      // Make password required only if Google ID is not present
      return !this.googleId;
    }
  },
  profilePicture: {type: String, required: false},
  googleId: String,
  uniqueLink: {
    type: String,
    default: uuidv4, // Automatically generate a UUID
    unique: true
  }
  // Add other necessary fields
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model('User', userSchema);
