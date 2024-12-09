const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    console.log('Authorization header:', req.headers.authorization);  // Проверка заголовка

    if (!token) {
      return res.status(401).json({ message: 'Нет токена, авторизация отклонена' });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log('Decoded JWT:', decoded);  // Debugging log

    const currentTime = Math.floor(Date.now() / 1000); // Current timestamp in seconds
    if (decoded.exp < currentTime) {
      return res.status(401).json({ message: 'Токен истек' });
    }

    console.log('Looking for user with ID:', decoded.userId);

    req.user = await User.findById(decoded.userId);
    if (!req.user) {
      console.log('User not found');
      return res.status(401).json({ message: 'Пользователь не найден' });
    }

    // Добавляем userId в body запроса
    req.body.userId = req.user._id;

    console.log('User found:', req.user);
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Неверный токен', error: error.message });
  }
};

module.exports = authMiddleware;
