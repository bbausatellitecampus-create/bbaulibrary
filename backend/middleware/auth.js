// const jwt = require("jsonwebtoken");

// const authMiddleware = (roles = []) => {
//   return (req, res, next) => {
//     const token = req.headers.authorization?.split(" ")[1];
//     if (!token) return res.status(401).json({ msg: "No token" });

//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = decoded;
//       if (roles.length && !roles.includes(req.user.role)) {
//         return res.status(403).json({ msg: "Forbidden" });
//       }
//       next();
//     } catch (err) {
//       res.status(401).json({ msg: "Invalid token" });
//     }
//   };
// };

// module.exports = authMiddleware;




const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Used to check if the user still exists

// 1. Protection Middleware (Checks for a valid token)
exports.protect = async (req, res, next) => {
    let token;

    // Check for token in the 'Authorization' header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        // Example: 'Bearer tokenString' -> tokenString
        token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
        return res.status(401).json({ msg: 'Not authorized to access this route. No token provided.' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find user by ID from the token payload
        req.user = await User.findById(decoded.id).select('role');

        if (!req.user) {
            return res.status(401).json({ msg: 'Not authorized. User not found.' });
        }
        
        // Attach user role to the request for authorization checks
        req.userRole = req.user.role; 

        next();
    } catch (error) {
        // This handles expired or invalid tokens
        return res.status(401).json({ msg: 'Not authorized. Invalid token.' });
    }
};

// 2. Authorization Middleware (Checks if the role matches the required roles)
exports.authorize = (...roles) => {
    return (req, res, next) => {
        // Check if the user's role is included in the list of allowed roles
        if (!roles.includes(req.userRole)) {
            return res.status(403).json({ 
                msg: `User role ${req.userRole} is not authorized to access this route.`
            });
        }
        next();
    };
};