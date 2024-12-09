const mongoose = require('mongoose');

// Определяем схему для коллекции "cases"
const caseSchema = new mongoose.Schema({
  case_number: { type: String, required: true },  // Номер дела
  дата_регистрации: { type: Date, required: true },  // Дата регистрации
  статья_ук_казахстана: { type: String, required: true },  // Статья УК Казахстана
  решение_по_делу: { type: String, required: true },  // Решение по делу
  краткая_фабула: { type: String, required: true },  // Краткая фабула
});

// Создаем модель, связав её с коллекцией "cases"
const Case = mongoose.model('Case', caseSchema, 'cases');

module.exports = Case;
