const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/db');
const session = require('express-session');
//const fs = require('fs');
//const http = require('http');
//const https = require('https');

//const privateKey  = fs.readFileSync('https/key.pem', 'utf8');
//const certificate = fs.readFileSync('https/cert.pem', 'utf8');
//const credentials = {key: privateKey, cert: certificate};

require('dotenv').config();

// Импорт маршрутов
const recipeRoutes = require('./routes/recipeRoutes');
const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profileRoutes');
const indexRoutes = require('./routes/indexRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authMiddleware = require('./middlewares/authMiddleware'); // Для защищённых маршрутов
const moderatorRoutes = require('./routes/moderatorRoutes.js')
const app = express();

// Настройка шаблонизатора EJS
app.set('view engine', 'ejs');
app.set('views', './views');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'supersecret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Установи true, если используешь HTTPS
}));

// Маршруты
app.use('/api/recipe', authMiddleware.verifyToken, recipeRoutes);
app.use('/api/users', userRoutes);
app.use('/profile', profileRoutes);
app.use('/', indexRoutes);
app.use('/moderator', moderatorRoutes);
app.use('/admin', adminRoutes);
app.get('/register', (req, res) => res.render('register', { error: req.query.error })); // Страница регистрации
app.get('/login', (req, res) => res.render('login', { error: req.query.error })); // Страница входа
app.get('/unauth', (req, res) => res.render('unauth'));

//const httpServer = http.createServer(app);
//const httpsServer = https.createServer(credentials, app);

//httpServer.listen(8080);
//httpsServer.listen(8443);

sequelize
    .sync()
    .then(() => {
        app.listen(3001, () => console.log('Сервер запущен на http://localhost:3001'));
    })
    .catch(err => console.log('Ошибка подключения к БД:', err));

module.exports = app;