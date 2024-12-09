const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

function roleMiddleware(requiredRoles) {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(403).json({ message: 'Токен отсутствует' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      req.user = await User.findById(decoded.userId);
      if (!req.user) {
        return res.status(403).json({ message: 'Пользователь не найден' });
      }

      if (!requiredRoles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Доступ запрещен' });
      }

      next();
    } catch (error) {
      res.status(403).json({ message: 'Ошибка авторизации' });
    }
  };
}


module.exports = roleMiddleware;
