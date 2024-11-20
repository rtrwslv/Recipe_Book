const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    username: { 
        type: DataTypes.STRING, 
        unique: true, 
        allowNull: false 
    },
    password: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    role: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        defaultValue: 'user',  // Значение по умолчанию — обычный пользователь
        validate: {
            isIn: [['user', 'moderator', 'admin']] // Возможные значения: user, moderator, admin
        }
    }
});

// Хеширование пароля перед созданием пользователя
User.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, 10);
});

module.exports = User;
