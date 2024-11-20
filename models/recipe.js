const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user'); // Импорт модели пользователя

const Recipe = sequelize.define('Recipe', {
    name: { type: DataTypes.STRING, allowNull: false }, // Название рецепта
    category: { type: DataTypes.STRING, allowNull: false }, // Категория (например, десерт, основное блюдо и т.д.)
    description: { type: DataTypes.TEXT, allowNull: true }, // Описание рецепта
    ingredients: { type: DataTypes.TEXT, allowNull: false }, // Список ингредиентов
    approved: { type: DataTypes.BOOLEAN, defaultValue: false},
    steps: { type: DataTypes.TEXT, allowNull: false }, // Шаги приготовления
    userId: { type: DataTypes.INTEGER, allowNull: false } // Внешний ключ для пользователя
});

// Связываем Recipe с User
Recipe.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(Recipe, { foreignKey: 'userId' });

module.exports = Recipe;
