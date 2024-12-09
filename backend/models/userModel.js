// userModel.js

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Сотрудник СУ', 'Аналитик СД', 'Модератор'], required: true },
  name: { type: String, required: true },
  регион: { type: String, required: true }, // новое поле для региона
  department: { type: String, required: true }, // новое поле для департамента
  date_registered: { type: Date, default: Date.now },
  profile_image: { type: String },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
