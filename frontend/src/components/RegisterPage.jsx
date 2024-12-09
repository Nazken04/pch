import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { regions, departments } from "../utils/data"; // Импортируем данные из data.js


const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: "Сотрудник СУ", // Default role
    region: "",  // Новый state для региона
    department: "",  // Новый state для департамента
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous error

    try {
      const response = await axios.post(
        "http://localhost:3350/api/auth/register",
        formData
      );
      alert("Регистрация успешна");
      navigate("/login"); // Redirect to login page after successful registration
    } catch (err) {
      setError(err.response?.data?.message || "Что-то пошло не так");
    }
  };

  return (
    <div>
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <label>
          Имя:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Пароль:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
          />
        </label>

        <label>
          Роль:
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="Сотрудник СУ">Сотрудник СУ</option>
            <option value="Аналитик СД">Аналитик СД</option>
            <option value="Модератор">Модератор</option>
          </select>
        </label>

        {/* Список регионов */}
        <label>
          Регион:
          <select
            name="region"
            value={formData.region}
            onChange={handleChange}
            required
          >
            <option value="">Выберите регион</option>
            {regions.map((region) => (
              <option key={region._id} value={region.name}>
                {region.name}
              </option>
            ))}
          </select>
        </label>

        {/* Список департаментов */}
        <label>
          Департамент:
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
          >
            <option value="">Выберите департамент</option>
            {departments.map((department) => (
  <option key={department._id} value={department.name}>
    {department.name} {/* Используйте department.name вместо department */}
  </option>
))}

          </select>
        </label>

        <button type="submit">Зарегистрироваться</button>
      </form>
    </div>
  );
};

export default RegisterPage;
