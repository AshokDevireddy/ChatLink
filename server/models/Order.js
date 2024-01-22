const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');


const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  address: { type: String, required: true },
  paymentAmount: { type: Number, required: true },
  orderSpecification: String,
  trackingNumber: { type: String, default: '' },
  uniqueLink: {
    type: String,
    default: uuidv4
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
  // Add other fields as necessary
});

module.exports = mongoose.model('Order', orderSchema);
