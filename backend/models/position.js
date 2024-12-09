const mongoose = require('mongoose');

const positionSchema = new mongoose.Schema({
  title: { type: String, required: true }
});

const Position = mongoose.model('Position', positionSchema);

module.exports = Position;
