const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Extract token from Authorization header
    if (!token) {
        return res.status(401).json({ message: 'Access denied.' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET); // Replace 'your-secret-key' with an environment variable for security
        req.user = verified; // Attach the decoded token payload to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        res.status(403).json({ message: 'Invalid token.' });
    }
};

module.exports = authenticateToken;