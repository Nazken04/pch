// userRoutes.js

const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Получение профиля
router.get('/profile', authMiddleware, userController.getProfile);
// Обновление профиля
router.put('/profile', authMiddleware, userController.updateProfile);
// Удаление профиля
router.delete('/profile', authMiddleware, userController.deleteProfile);

module.exports = router;
