const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'] || '';
    if (authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) return res.send({ success: false, code: 401, message: "Unauthorized access" });
            req.user = decoded;
            next();
        });
    } else {
        res.send({ success: false, code: 401, message: "Unauthorized access" });
    }
};

module.exports = authMiddleware;
