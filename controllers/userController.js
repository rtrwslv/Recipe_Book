const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Регистрируем пользователя
exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.create({ username, password });
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        req.session.token = token;

        res.redirect('/');
    } catch (error) {
        console.log(error)
        return res.redirect('/register?error=invalid');
    }
};

// Логиним пользователя
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } });

        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.redirect('/login?error=invalid');
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        req.session.token = token;

        res.redirect('/');
    } catch (error) {
        if (!res.headersSent) {
            console.log(error)
            res.status(500).send('Внутренняя ошибка сервера.');
        }
    }
};

// Удаляем пользователя
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        await user.destroy();

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Сделать пользователя администратором
exports.makeAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        // Находим пользователя по ID
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        // Обновляем роль пользователя на "admin"
        user.role = 'admin';
        await user.save();

        res.status(200).json({ message: 'Пользователь теперь администратор' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Сделать пользователя модератором
exports.makeModerator = async (req, res) => {
    try {
        const { id } = req.params;

        // Находим пользователя по ID
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        // Обновляем роль пользователя на "admin"
        user.role = 'moderator';
        await user.save();

        res.status(200).json({ message: 'Пользователь теперь модератор' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Получить список всех пользователей
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
