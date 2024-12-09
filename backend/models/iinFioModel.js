const mongoose = require('mongoose');

// Определяем схему для коллекции "iin_fio"
const iinSchema = new mongoose.Schema({
  iin: { type: String, required: true },  // ИИН
  full_name: { type: String, required: true },  // ФИО
});

// Используем проверку на существование модели
const Iin = mongoose.models.Iin || mongoose.model('Iin', iinSchema, 'iin_fio');

module.exports = Iin;
