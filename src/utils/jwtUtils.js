const jwt = require('jsonwebtoken');
const { config } = require('../config/config');
const { TOKEN_KEY } = config;

/**
 * Generates a JWT access token for authentication.
 * @param {Object} payload - The payload data to encode in the token.
 * @param {string} [expiresIn='10d'] - Expiration time for the token (default: 10 days).
 * @returns {string} - Signed JWT token.
 */
const generateAccessToken = (payload, expiresIn = '10d') => {
    return jwt.sign(payload, TOKEN_KEY, { expiresIn });
};

/**
 * Verifies and decodes a JWT token.
 * @param {string} token - The JWT token to verify.
 * @returns {Object|null} - Decoded payload if valid, null if invalid or expired.
 */
const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, TOKEN_KEY);
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        return null;
    }
};

module.exports = { generateAccessToken, verifyAccessToken };
