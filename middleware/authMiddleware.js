const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization') && req.header('Authorization').replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No hay token, autorización denegada' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifica el token
        req.user = decoded;  // Decodifica y asigna el userId del token al objeto req.user
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token no válido' });
    }
};


module.exports = authMiddleware;
