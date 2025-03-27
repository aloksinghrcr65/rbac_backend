const jwt = require('jsonwebtoken');
const { verifyAccessToken } = require('../utils/jwt-utils');

/**
 * Middleware to authenticate users based on JWT.
 * Extracts token from headers, body, query, or cookies.
 */
const authenticate = async (req, res, next) => {
    try {
        // Extract token from multiple possible locations
        let authToken = req.body.token || req.query.token || req.headers["authorization"] || req.cookies?.cookies;

        if (!authToken) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided."
            });
        }

        const token = authToken.startsWith("Bearer ") ? authToken.split(" ")[1] : authToken;
        const decoded = verifyAccessToken(token);

        req.user = decoded; // Attach decoded user data to request
        next(); // Continue to next middleware or route handler
    } catch (error) {
        console.error("JWT Authentication Error:", error);

        // Handle different JWT errors
        if (error.name === "TokenExpiredError") {
            return res.status(403).json({
                success: false,
                message: "Session expired. Please log in again."
            });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid token. Authentication failed."
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error during authentication.",
            error: error.message
        });
    }
};

module.exports = { authenticate };
