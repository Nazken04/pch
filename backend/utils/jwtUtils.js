const jwt = require('jsonwebtoken');
const { SECRET_KEY } = process.env;

// Генерация JWT токена
function generateToken(userId, role) {
  const token = jwt.sign({ userId, role }, SECRET_KEY, { expiresIn: '15h' });
  return token;
}

// Проверка JWT токена
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded;
  } catch (err) {
    throw new Error('Неверный или просроченный токен');
  }
}

module.exports = { generateToken, verifyToken };
