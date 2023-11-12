const authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.roles === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden - Admin access required' });
    }
};

module.exports.authorizeAdmin = authorizeAdmin;
