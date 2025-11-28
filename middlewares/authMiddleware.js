const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const header = req.headers['authorization']
    const token = header && header.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token Not Found' })
    jwt.verify(token, process.env.JWT, (err, user) => {
        if (err) return res.status(401).json({ message: 'Invalid Token' })
        req.user = user;
        next();
    })
}
