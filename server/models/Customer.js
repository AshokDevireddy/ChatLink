const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const businessSchema = new mongoose.Schema({
  // existing fields...
  uniqueLink: { type: String, unique: true, default: uuidv4 }
});

module.exports = mongoose.model('Business', businessSchema);
