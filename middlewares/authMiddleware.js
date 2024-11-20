const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const token = req.session.token;

    if (!token) {
        // Если токен отсутствует, перенаправляем GET-запросы на /login, для других запросов — ошибка 401
        if (req.method === 'GET') {
            return res.redirect('/login');
        } else {
            return res.status(401).send('Unauthorized');
        }
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error('Invalid token:', error.message);
        return res.status(401).send('Invalid token');
    }
};
