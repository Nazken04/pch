const mongoose = require('mongoose');

const businessStatusSchema = new mongoose.Schema({
  status: { type: String, required: true }
});

const BusinessStatus = mongoose.model('BusinessStatus', businessStatusSchema);

module.exports = BusinessStatus;
