const express = require('express');
const cardController = require('../controllers/cardController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// Создание карточки со статусом "В работу"
router.post('/', authMiddleware, async (req, res, next) => {
    try {
        await cardController.createCard(req, res);
    } catch (err) {
        next(err);
    }
});

// Создание карточки со статусом "На согласовании"
router.post('/create-on-approval', authMiddleware, async (req, res, next) => {
  try {
    const cardData = { ...req.body };  // Передаем все данные карточки
    cardData.status = "На согласовании";  // Устанавливаем статус "На согласовании"
    await cardController.createCardWithFixedStatus(req, res, cardData);  // Вызываем контроллер с фиксированным статусом
  } catch (err) {
    next(err);
  }
});

// Получение карточки по ID
router.get('/:id', authMiddleware, async (req, res, next) => {
  console.log('API request for card ID:', req.params.id);  // Log the request
  try {
    await cardController.getCardById(req, res);
  } catch (err) {
    next(err);
  }
});

// Обновление карточки
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['Сотрудник СУ', 'Аналитик СД', 'Модератор']), // Ограничиваем доступ к ролям
  async (req, res, next) => {
    try {
      await cardController.updateCard(req, res);
    } catch (err) {
      next(err);
    }
  }
);


// Согласование карточки
router.post(
  '/:id/approve',
  authMiddleware,  // Авторизация
  roleMiddleware(['Аналитик СД']),  // Роль для доступ к согласованию
  async (req, res, next) => {
      console.log('User role in request:', req.user.role);  // Логирование роли перед проверкой
      try {
          await cardController.approveCard(req, res);
      } catch (err) {
          next(err);
      }
  }
);

// Отказ от согласования карточки
router.post(
  '/:id/reject',
  authMiddleware,
  roleMiddleware(['Аналитик СД']), 
  cardController.rejectCard
);

// Отправка карточки на доработку
router.post(
  '/:id/revision',
  authMiddleware,
  roleMiddleware(['Аналитик СД']), 
  cardController.sendCardForRevision
);

// Оставить карточку без рассмотрения
router.post(
  '/:id/leave',
  authMiddleware,
  roleMiddleware(['Аналитик СД']), 
  cardController.leaveCardWithoutConsideration
);


// Получение списка карточек с фильтрацией
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    await cardController.getCards(req, res);
  } catch (err) {
    next(err);
  }
});


router.get('/check-history/:iin', authMiddleware, async (req, res, next) => {
  try {
    await cardController.checkCallHistory(req, res);
  } catch (err) {
    next(err);
  }
});

// Назначение статуса "Отправлено на доработку"
router.post(
  '/:id/send-for-revision',
  authMiddleware, // Проверка токена и установка req.user
  roleMiddleware(['Модератор', 'Аналитик СД']), // Проверка роли
  async (req, res, next) => {
    try {
      console.log('User from authMiddleware:', req.user); // Логируем req.user для отладки
      await cardController.markCardForRevision(req, res);
    } catch (err) {
      next(err);
    }
  }
);

// Экспорт данных в Excel
router.get('/export/excel', authMiddleware, async (req, res, next) => {
  try {
    await cardController.exportToExcel(req, res);
  } catch (err) {
    next(err);
  }
});

// Экспорт данных в PDF
router.get('/export/pdf', authMiddleware, async (req, res, next) => {
  try {
    await cardController.exportToPdf(req, res);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
