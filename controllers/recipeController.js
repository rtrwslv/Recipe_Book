const Recipe = require('../models/recipe');

exports.createRecipe = async (req, res) => {
    try {
        const { name, category, description, ingredients, steps } = req.body;
        const userId = req.userId; // Получаем userId из токена

        // Проверяем, что userId существует
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        // Проверяем, что все необходимые поля переданы
        if (!name || !category || !description || !ingredients || !steps) {
            return res.status(400).json({ error: 'Все поля обязательны для заполнения' });
        }

        // Создаем новый рецепт с обязательным userId
        const recipe = await Recipe.create({
            name,
            category,
            description,
            ingredients,
            steps,
            userId // Передаем userId
        });

        res.status(201).json(recipe);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.findAll();
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateRecipe = async (req, res) => {
    try {
        const { id } = req.params;
        const recipe = await Recipe.findByPk(id);

        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        await recipe.update(req.body);
        res.json(recipe);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteRecipe = async (req, res) => {
    try {
        const { id } = req.params;
        const recipe = await Recipe.findByPk(id);

        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        await recipe.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
