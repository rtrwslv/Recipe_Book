const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
const RecipeItem = require('../models/recipe');

router.get('/', authMiddleware.verifyToken, async (req, res) => {
    try {
        const recipesRaw = await RecipeItem.findAll({
            where: {
                approved: true  // Только рецепты с approved === true
            }
        });
        const recipes = recipesRaw.map(recipe => recipe.dataValues);
        res.render('index', { recipes });
    } catch (error) {
        console.error('Error loading profile:', error.message);
        res.status(500).send('Ошибка загрузки страницы');
    }
});

module.exports = router;
