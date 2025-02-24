const User = require('../../models/User');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('lodash');

const registerUser = async (req, res) => {
    try {
        // Validate request input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation errors",
                errors: errors.array(),
            });
        }


        // const body = req.body;
        const { email, password } = req.body
        const isUserExist = await User.findOne({ email });
        if (isUserExist) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered. Please log in instead."
            })
        };

        const hashedPassword = await bcrypt.hash(password, 10);

        // body = { ...body, password: hashedPassword };

        // Securely pick only allowed fields
        const allowedFields = Object.keys(User.schema.paths); // Dynamically fetch schema fields
        let userData = _.pick(req.body, allowedFields);
        userData.password = hashedPassword
        const user = new User(userData);
        const savedUser = await user.save();


        // savedUser.password = undefined;
        // savedUser.__v = undefined;


        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: savedUser._id,
                username: savedUser.username,
                name: savedUser.name,
                email: savedUser.email,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error. Please try again later.",
            error: error.message
        })
    }
};


module.exports = {
    registerUser
}