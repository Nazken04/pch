const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const cardRoutes = require("./routes/cardRoutes");
const Counter = require("./models/counterModel");

const app = express();
const PORT = process.env.PORT || 3350;

// Подключение к базе данных
async function initializeDatabase() {
  try {
    await connectDB();
    console.log('База данных успешно подключена!');
  } catch (err) {
    console.error('Ошибка при подключении к базе данных:', err);
    process.exit(1); // Завершаем приложение, если подключение не удалось
  }
}

// Запуск инициализации базы данных
initializeDatabase();

// Middleware для обработки JSON
app.use(express.json());

// Enable CORS for frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Использование переменной окружения для URL фронтенда
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Роуты
app.use("/api/auth", authRoutes); // Авторизация и регистрация
app.use("/api/user", userRoutes); // Пользовательские операции
app.use("/api/cards", cardRoutes); // Операции с карточками

// Backend route for fetching card details
app.get('/api/cards/:id', async (req, res) => {
  try {
    const card = await Card.findById(req.params.id).populate('approval_path.position');  
    console.log("Returned card:", card);

    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }
    res.json(card);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Инициализация счетчика
const initializeCounter = async () => {
  try {
    const counter = await Counter.findOneAndUpdate(
      { _id: "registrationNumber" },
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true }
    );
    console.log("Counter initialized or updated:", counter);
  } catch (error) {
    console.error("Ошибка при инициализации счетчика:", error);
  }
};

initializeCounter();

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
