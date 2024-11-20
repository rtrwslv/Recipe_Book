const RecipeItem = require('../models/recipe');
const UserItem = require('../models/user');
const { Op } = require('sequelize');

// Страница для модератора (отображение всех рецептов)
exports.moderatorPage = async (req, res) => {
    try {
        const user = await UserItem.findByPk(req.userId);
        if (!user || user.role !== 'moderator') {
            return res.redirect('/unauth');
        }

        const recipes = await RecipeItem.findAll({
            where: {
                approved: { [Op.ne]: true } // Выбираем только те рецепты, где approved не равно true
            }
        });

        res.render('moderator', { recipes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Удаление рецепта (кнопка "Кринж")
exports.deleteRecipe = async (req, res) => {
    try {
        const user = await UserItem.findByPk(req.userId);
        if (!user || user.role !== 'moderator') {
            return res.redirect('/unauth');
        }
        const { id } = req.params;

        const recipe = await RecipeItem.findByPk(id);
        if (!recipe) {
            return res.status(404).json({ error: 'Рецепт не найден' });
        }

        await recipe.destroy();  // Удаляем рецепт из базы
        res.redirect('/moderator');  // Перенаправляем обратно на модераторскую страницу
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Перемещение рецепта на главную страницу (кнопка "База")
exports.addToHomepage = async (req, res) => {
    try {
        const user = await UserItem.findByPk(req.userId);
        if (!user || user.role !== 'moderator') {
            return res.redirect('/unauth');
        }
        const { id } = req.params;

        const recipe = await RecipeItem.findByPk(id);
        if (!recipe) {
            return res.status(404).json({ error: 'Рецепт не найден' });
        }

        recipe.approved = true; // Устанавливаем флаг, чтобы рецепт оказался на главной странице
        await recipe.save();

        res.redirect('/moderator'); // Перенаправляем обратно на модераторскую страницу
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
