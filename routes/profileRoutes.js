const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
const RecipeItem = require('../models/recipe');
const User = require('../models/user');

router.get('/', authMiddleware.verifyToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.userId);
        if (!user) {
            console.error('User not found');
            return res.status(404).send('User not found');
        }

        const recipe = await RecipeItem.findAll({ where: { userId: req.userId } });

        res.render('profile', { user, recipe });
    } catch (error) {
        console.error('Error loading profile:', error.message);
        res.status(500).send('Ошибка загрузки профиля');
    }
});

module.exports = router;
