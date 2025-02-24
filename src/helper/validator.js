const { check } = require("express-validator");

exports.registerValidator = [
    check("name")
        .trim()
        .notEmpty().withMessage("Name is required")
        .isLength({ min: 3 }).withMessage("Name must be at least 3 characters long")
        .matches(/^[a-zA-Z\s]+$/).withMessage("Name can only contain letters and spaces"),

    check("username")
        .trim()
        .notEmpty().withMessage("Username is required")
        .isLength({ min: 3, max: 20 }).withMessage("Username must be between 3 to 20 characters long")
        .matches(/^[a-zA-Z0-9_]+$/).withMessage("Username can only contain letters, numbers, and underscores"),

    check("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Please enter a valid email address")
        .normalizeEmail({ gmail_remove_dots: false })
        .toLowerCase(),

    check("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
        .matches(/[0-9]/).withMessage("Password must contain at least one number")
        .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
        .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
        .matches(/[\W]/).withMessage("Password must contain at least one special character (@, #, $, etc.)"),
];
