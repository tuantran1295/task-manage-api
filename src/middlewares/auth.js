const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

module.exports = (roles = []) => (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const payload = jwt.verify(auth.split(' ')[1], JWT_SECRET);
        req.user = payload;
        if (roles.length && !roles.includes(payload.role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        next();
    }   catch {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}