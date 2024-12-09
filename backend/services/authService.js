// authService.js

const bcrypt = require('bcryptjs');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { SECRET_KEY } = process.env;

// Обновленная схема для регистрации с добавлением регион и department
const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().required(),
  role: Joi.string().valid('Сотрудник СУ', 'Аналитик СД', 'Модератор').required(),
  регион: Joi.string().required(), // Добавлено
  department: Joi.string().required(), // Добавлено
});

async function registerUser(email, password, name, role, регион, department) {
  const { error } = schema.validate({ email, password, name, role, регион, department });
  if (error) {
    throw new Error(error.details[0].message);
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Пользователь с таким email уже существует');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    email,
    password: hashedPassword,
    name,
    role,
    регион,
    department,
  });

  await newUser.save();
  return newUser;
}

// Логин пользователя и создание JWT токена
async function loginUser(email, password) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Неверный email или пароль');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Неверный email или пароль');
  }
  
  const token = jwt.sign({ userId: user._id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
  return { user, token };
}

// Функция сброса пароля
async function resetPassword(email, newPassword) {
    // Найдем пользователя по email
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Пользователь с таким email не найден');
    }
  
    // Хешируем новый пароль
    const hashedPassword = await bcrypt.hash(newPassword, 10);
  
    // Обновляем пароль пользователя
    user.password = hashedPassword;
    await user.save();
  
    return user;
  }
  
module.exports = { registerUser, loginUser, resetPassword  };
