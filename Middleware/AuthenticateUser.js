const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.SECRET_KEY); 

        req.user = decoded.user;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }
};

module.exports.authenticateUser = authenticateUser;
