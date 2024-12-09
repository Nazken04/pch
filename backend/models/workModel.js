const mongoose = require('mongoose');

// Определяем схему для коллекции "work"
const workplaceSchema = new mongoose.Schema({
  iin: { type: String, required: true },  // ИИН
  workplace: { type: String, required: true },  // Рабочее место
  bin: { type: String, required: true },  // БИН
});

// Создаем модель, связав её с коллекцией "work"
const Workplace = mongoose.model('Workplace', workplaceSchema, 'work');

module.exports = Workplace;
