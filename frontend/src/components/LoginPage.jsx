import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email || !password) {
      setError('Все поля должны быть заполнены.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Введите корректный email.');
      return false;
    }
    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов.');
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;
  
    try {
      const response = await axios.post(' http://localhost:3350/api/auth/login', { email, password });
      const { user, token } = response.data;
      // Store token and user data in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
  
      console.log('Login successful, redirecting to profile'); // Debugging log
  
      // Redirect to profile page
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка авторизации.');
    }
  };

  return (
    <div className="login-container">
      <h2>Вход в систему</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Введите email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Пароль:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль"
            required
          />
        </div>
        <button type="submit" className="login-button">
          Войти
        </button>
      </form>
      <div className="links">
        <a href="/forgot-password">Забыли пароль?</a>
        <a href="/register">Регистрация</a>
      </div>
    </div>
  );
};

export default LoginPage;
