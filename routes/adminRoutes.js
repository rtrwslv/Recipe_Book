const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
const RecipeItem = require('../models/recipe');
const UserItem = require('../models/user');

router.get('/', authMiddleware.verifyToken, async (req, res) => {
    try {
        const user = await UserItem.findByPk(req.userId);

        // Проверяем, что пользователь существует и у него роль "admin"
        if (!user || user.role !== 'admin') {
            return res.redirect('/unauth');
        }

        const recipesRaw = await RecipeItem.findAll();
        const recipes = recipesRaw.map(recipe => recipe.dataValues);

        const usersRaw = await UserItem.findAll();
        const users = usersRaw.map(user => user.dataValues);

        console.log(users, recipes);
        res.render('admin', { users, recipes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
