import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/ProfilePage.css";
import Avatar from "@mui/material/Avatar";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const navigate = useNavigate();
  const tokenKey = "token";

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem(tokenKey); // Use the same key as in LoginPage

      if (!token) {
        console.error("Token not found. Redirecting to login.");
        return navigate("/login", { replace: true });
      }

      try {
        const response = await axios.get("http://localhost:3350/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
        setEditedUser(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке профиля пользователя:", error);
        alert("Ошибка при получении профиля");
      }
    };

    if (!user) {
      fetchUserData();
    }
  }, [navigate, user]);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const handleSaveClick = async () => {
    // Отправляем только те данные, которые нужно обновить: name и email
    const updatedData = {
      name: editedUser.name,
      email: editedUser.email,
    };
    console.log(updatedData);  // Выведет данные, которые отправляются на сервер

    try {
      await axios.put("http://localhost:3350/api/user/profile", updatedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUser(editedUser);
      setIsEditing(false);
      alert("Профиль успешно обновлен");
    } catch (error) {
      console.error("Ошибка при обновлении профиля:", error);
      alert("Ошибка при обновлении профиля");
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Вы уверены, что хотите удалить свой аккаунт?")) {
      try {
        await axios.delete("http://localhost:3350/api/user/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        localStorage.removeItem("token");
        navigate("/login");
      } catch (error) {
        console.error("Ошибка при удалении аккаунта:", error);
        alert("Ошибка при удалении аккаунта");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) return <div>Загрузка...</div>;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-info">
          <Avatar
            alt="Фото профиля"
            src="https://via.placeholder.com/150"
            sx={{
              width: 100,
              height: 100,
              marginBottom: 15,
              border: "2px solid #4285f4",
            }}
          />
          <div className="profile-name">{user.name}</div>
          <div className="profile-email">{user.email}</div>
        </div>
        <Button
          variant="contained"
          className="edit-button"
          onClick={handleEditClick}
        >
          {isEditing ? "Отменить" : "Редактировать"}
        </Button>
      </div>

      <div className="profile-details">
        <div className="form-group">
          <TextField
            label="Полное имя"
            variant="outlined"
            fullWidth
            name="name"
            value={isEditing ? editedUser.name : user.name}
            onChange={isEditing ? handleChange : null}
            disabled={!isEditing}
          />
        </div>

        <div className="form-group">
          <TextField
            label="Электронная почта"
            variant="outlined"
            fullWidth
            name="email"
            value={isEditing ? editedUser.email : user.email}
            onChange={isEditing ? handleChange : null}
            disabled={!isEditing}
          />
        </div>

        <div className="form-group">
          <TextField
            label="Регион"
            variant="outlined"
            fullWidth
            value={user.region} // Исправлено
            disabled
          />
        </div>


        <div className="form-group">
          <TextField
            label="Департамент"
            variant="outlined"
            fullWidth
            value={user.department}
            disabled
          />
        </div>

        <div className="form-group">
          <TextField
            label="Дата регистрации"
            variant="outlined"
            fullWidth
            value={formatDate(user.date_registered)}
            disabled
          />
        </div>
      </div>

      <div className="actions">
        {isEditing && (
          <Button
            variant="contained"
            color="primary"
            type="submit"
            onClick={handleSaveClick}
            sx={{ marginRight: 2 }}
          >
            Сохранить
          </Button>
        )}

        <Button
          variant="contained"
          color="secondary"
          onClick={handleLogout}
          sx={{ marginRight: 2 }}
        >
          Выйти
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleDeleteAccount}
        >
          Удалить аккаунт
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;
