const User = require("../../models/User");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const randomstring = require("randomstring");
const sendMail = require("../../utils/sendMail");
const generateEmailTemplate = require("../../utils/generateEmailTemplate");

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
        message: "Email already exists",
      });
    }

    const isUserNameExist = await User.findOne({ username });
    if (isUserNameExist) {
      return res.status(409).json({
        success: false,
        message: "Username already exists",
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
      password: hashedPassword,
    };

    if (req.body.role && req.body.role === 1) {
      return res.status(400).json({
        success: false,
        message: "You don't have permission to create an Admin",
      });
    } else if (req.body.role) {
      userObj.role = parseInt(req.body.role);
    }

    const user = new User(userObj);
    const userData = await user.save();
    userData.password = undefined;

    // Generate email content
    const emailContent = await generateEmailTemplate(
      name,
      email,
      password,
      user.role
    );

    await sendMail(
      email,
      "Welcome to Makeup-Pro! 🎉 Your Account Details",
      emailContent
    );

    return res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      user: userData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
      error: error.message,
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -__v").lean();
    if (!users || users.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No any user found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
      error: error.message,
    });
  }
};

const getUserById = async (req, res) => {
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

    const { id } = req.body;

    const user = await User.findById(id).select("-password -__v");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User details is here",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
      error: error.message,
    });
  }
};

const updateUser = async (req, res) => {
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

    const { id, name, email, username } = req.body;
    const isExists = await User.findById(id);
    if (!isExists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let updateObj = {
      name: name || isExists.name,
      username: username || isExists.username,
      email: email || isExists.email,
    };

    if (req.body.role && req.body.role === 1) {
      return res.status(400).json({
        success: false,
        message: "Sorry, you don't have permission to create an admin",
      });
    } else if (req.body.role) {
      updateObj.role = parseInt(req.body.role) || isExists.role;
    }

    const updateUser = await User.findByIdAndUpdate(
      id,
      { $set: updateObj },
      { new: true, runValidators: true }
    ).select("-password");
    return res.status(200).json({
      success: true,
      message: "User Updated Successfully",
      user: updateUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
      error: error.message,
    });
  }
};

const updateUserPut = async (req, res) => {
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

    const { id } = req.params;
    const { name, email, username, password, role } = req.body;

    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (role && parseInt(role) === 1) {
      return res.status(400).json({
        success: false,
        message: "Sorry, you don't have permission to create an admin",
      });
    }

    // Create a completely new document without keeping missing fields
    const newUserData = {
      name,
      username,
      email,
      password: existingUser.password,
      role: role ? parseInt(role) : undefined,
    };

    // Completely replace the document
    await User.replaceOne({ _id: id }, newUserData);

    // Fetch the updated user
    const updatedUser = await User.findById(id).select("-password");

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
      error: error.message,
    });
  }
};

const updateUserPatch = async (req, res) => {
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

    const { id } = req.params;
    const { name, email, username, role } = req.body;

    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prepare update object (only provided fields)
    let updateObj = {};
    if (name) updateObj.name = name;
    if (username) updateObj.username = username;
    if (email) updateObj.email = email;

    if (role) {
      if (parseInt(role) === 1) {
        return res.status(400).json({
          success: false,
          message: "Sorry, you don't have permission to create an admin",
        });
      }
      updateObj.role = parseInt(role);
    }

    // Partial update - Updates only provided fields
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateObj },
      { new: true, runValidators: true }
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
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

    const { id } = req.body;

    const user = await User.findByIdAndDelete(id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        })
    }
    return res.status(200).json({
        success: true,
        message: "User deleted successfully"
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
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateUserPut,
  updateUserPatch,
  deleteUser,
};
