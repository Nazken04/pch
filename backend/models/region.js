
const mongoose = require('mongoose');

const regionSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

const Region = mongoose.model('Region', regionSchema);

module.exports = Region;
