const userService = require('../services/userService');
const authService = require('../services/authService');

const User = require('../models/userModel');

const getProfile = async (req, res) => {
  try {
    const user = req.user;  // req.user is set by authMiddleware
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения профиля' });
  }
};

// userController.js

const updateProfile = async (req, res) => {
  try {
    const user = req.user;  // req.user is set by authMiddleware
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const { name, email, password } = req.body;

    // Если передан новый пароль, хешируем его
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    // Обновляем другие данные (имя и email)
    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();
    res.status(200).json({ message: 'Профиль обновлён', user });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка обновления профиля', error: error.message });
  }
};

// Функция для сброса пароля (новая)
const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Хешируем новый пароль
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Пароль успешно изменён' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при изменении пароля', error: error.message });
  }
};



const deleteProfile = async (req, res) => {
    try {
      const user = req.user;  // req.user is set by authMiddleware
      if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }
  
      // Log the user object to see if it's correct
      console.log('User to delete:', user);
  
      // Use `deleteOne()` or `findByIdAndDelete()`
      await User.findByIdAndDelete(user._id);  // Delete the user by their ID
  
      // If deletion is successful
      res.status(200).json({ message: 'Профиль удалён' });
    } catch (error) {
      console.error('Error deleting user:', error);  // Log the error for debugging
      res.status(500).json({ message: 'Ошибка удаления профиля' });
    }
  };
  
  

  module.exports = { getProfile, updateProfile, deleteProfile, resetPassword };
