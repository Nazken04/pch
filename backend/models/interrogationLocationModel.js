const mongoose = require('mongoose');

// Определение схемы для коллекции
const interrogationLocationSchema = new mongoose.Schema({
  location: { type: String, required: true }
});

// Создание модели, связывающейся с существующей коллекцией 'interrogationLocations'
const InterrogationLocation = mongoose.model('InterrogationLocation', interrogationLocationSchema, 'interrogationLocations');

module.exports = InterrogationLocation;
