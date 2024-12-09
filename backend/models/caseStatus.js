const mongoose = require('mongoose');

const caseStatusSchema = new mongoose.Schema({
  status: { type: String, required: true }
});

const CaseStatus = mongoose.model('CaseStatus', caseStatusSchema);

module.exports = CaseStatus;
