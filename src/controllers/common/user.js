const User = require("../../models/User");
const { validationResult } = require("express-validator");
const bcrypt = require('bcrypt');
const randomstring = require('randomstring');
const sendMail = require('../../utils/sendMail');
const generateEmailTemplate = require('../../utils/generateEmailTemplate');

const createUser = async (req, res) => {
  try {
    // Validate request input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Invalid input data. Please check your request and try again.",
            errors: errors.array(),
        });
    }

    let { name, username, email, password } = req.body;

    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
        return res.status(409).json({
            success: false,
            message: "Email already exists"
        });
    }

    const isUserNameExist = await User.findOne({ username });
    if (isUserNameExist) {
        return res.status(409).json({
            success: false,
            message: "Username already exists"
        });
    }

    if (!password) {
        password = randomstring.generate(8);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let userObj = {
        name,
        username,
        email,
        password: hashedPassword
    };

    if (req.body.role && req.body.role === 1) {
        return res.status(400).json({
            success: false,
            message: "You don't have permission to create an Admin"
        })
    }  else if (req.body.role) {
        userObj.role = parseInt(req.body.role);
    }

    const user = new User(userObj);
    const userData = await user.save();
    userData.password = undefined;

    // Generate email content
    const emailContent = await generateEmailTemplate(name, email, password, user.role);

    await sendMail(email, "Welcome to Makeup-Pro! 🎉 Your Account Details", emailContent);

    return res.status(201).json({
        success: true,
        message: "User Registered Successfully",
        user: userData
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
      error: error.message,
    });
  }
};

module.exports = {
    createUser
}
