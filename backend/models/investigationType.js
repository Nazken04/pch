const mongoose = require('mongoose');

const investigationTypeSchema = new mongoose.Schema({
  type: { type: String, required: true }
});

const InvestigationType = mongoose.model('InvestigationType', investigationTypeSchema);

module.exports = InvestigationType;
