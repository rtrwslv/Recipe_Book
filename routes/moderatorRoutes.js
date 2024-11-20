const express = require('express');
const router = express.Router();
const moderatorController = require('../controllers/moderatorController');
const authMiddleware = require('../middlewares/authMiddleware');

// Страница модератора
router.get('/', authMiddleware.verifyToken, moderatorController.moderatorPage);

// Удаление рецепта
router.post('/recipe/:id/delete', authMiddleware.verifyToken, moderatorController.deleteRecipe);

// Перемещение рецепта на главную страницу
router.post('/recipe/:id/add-to-homepage', authMiddleware.verifyToken, moderatorController.addToHomepage);

module.exports = router;
