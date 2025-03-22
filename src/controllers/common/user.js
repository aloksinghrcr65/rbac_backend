const User = require("../../models/User");
const Permission = require("../../models/Permission");
const UserPermissions = require("../../models/UserPermission");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
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

    let permissions = [];

    // Add permissions if provided in request
    if (req.body.permissions !== undefined && req.body.permissions.length > 0) {
      const addPermissions = req.body.permissions;

      const permissionArray = [];
      await Promise.all(
        addPermissions.map(async (permission) => {
          const permissionData = await Permission.findById(permission.id);
          if (permissionData) {
            permissionArray.push({
              permission_name: permissionData.permission_name,
              permission_value: permission.value,
            });
          }
        })
      );

      const userPermissions = new UserPermissions({
        user_id: user._id,
        permissions: permissionArray,
      });

      await userPermissions.save();
      permissions = permissionArray; // Store permissions for response
    }

    // Generate email content
    const emailContent = await generateEmailTemplate(
      name,
      email,
      password,
      user.role
    );

    // await sendMail(
    //   email,
    //   "Welcome to Makeup-Pro! 🎉 Your Account Details",
    //   emailContent
    // );

    return res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      user: userData,
      permissions: permissions,
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
    // const users = await User.find({ _id: {
    //     $ne: req.user.id
    // }}).select("-password -__v").lean();

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: new mongoose.Types.ObjectId(req.user.id) },
        },
      },
      {
        $lookup: {
          from: "userpermissions",
          localField: "_id",
          foreignField: "user_id",
          as: "permissions",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          username: 1,
          email: 1,
          role: 1,
          permissions: {
            $cond: {
              if: { $isArray: "$permissions" },
              then: { $arrayElemAt: ["$permissions", 0] },
              else: null,
            },
          },
        },
      },
      {
        $addFields: {
          permissions: {
            permissions: "$permissions.permissions",
          },
        },
      },
    ]);
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
    // Fetch user and check for existing email/username in parallel
    const [existingUser, conflictingUser] = await Promise.all([
      User.findById(id),
      email || username
        ? User.findOne({
            $or: [{ email }, { username }],
            _id: { $ne: id }, // Exclude the current user
          })
        : null,
    ]);

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (conflictingUser) {
      if (conflictingUser.email === email) {
        return res.status(409).json({
          success: false,
          message: "Email already exists. Please use another.",
        });
      }
      if (conflictingUser.username === username) {
        return res.status(409).json({
          success: false,
          message: "Username already exists. Please use another.",
        });
      }
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

    let permissions = [];

    // Add permissions if provided in request
    if (req.body.permissions !== undefined && req.body.permissions.length > 0) {
      const addPermissions = req.body.permissions;

      const permissionArray = [];
      await Promise.all(
        addPermissions.map(async (permission) => {
          const permissionData = await Permission.findById(permission.id);
          if (permissionData) {
            permissionArray.push({
              permission_name: permissionData.permission_name,
              permission_value: permission.value,
            });
          }
        })
      );

      const updatePermission = await UserPermissions.findOneAndUpdate(
        { user_id: updateUser._id },
        { permissions: permissionArray },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

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
    const { name, email, username, role } = req.body;

    // Fetch existing user and check if email or username is already used by another user
    const [existingUser, existingUserCheck] = await Promise.all([
      User.findById(id),
      User.findOne({
        $or: [{ email }, { username }],
        _id: { $ne: id }, // Exclude current user
      }),
    ]);

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (existingUserCheck) {
      if (existingUserCheck.email === email) {
        return res.status(409).json({
          success: false,
          message: "Email already exists. Please use another.",
        });
      }
      if (existingUserCheck.username === username) {
        return res.status(409).json({
          success: false,
          message: "Username already exists. Please use another.",
        });
      }
    }

    if (role && parseInt(role) === 1) {
      return res.status(400).json({
        success: false,
        message: "Sorry, you don't have permission to create an admin",
      });
    }

    // Update user
    existingUser.name = name || existingUser.name;
    existingUser.username = username || existingUser.username;
    existingUser.email = email || existingUser.email;
    existingUser.role = role ? parseInt(role) : existingUser.role;

    await existingUser.save();

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: {
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        username: existingUser.username,
        role: existingUser.role,
      },
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

    // Fetch user and check for existing email/username in parallel
    const [existingUser, conflictingUser] = await Promise.all([
      User.findById(id),
      email || username
        ? User.findOne({
            $or: [{ email }, { username }],
            _id: { $ne: id }, // Exclude the current user
          })
        : null,
    ]);

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (conflictingUser) {
      if (conflictingUser.email === email) {
        return res.status(409).json({
          success: false,
          message: "Email already exists. Please use another.",
        });
      }
      if (conflictingUser.username === username) {
        return res.status(409).json({
          success: false,
          message: "Username already exists. Please use another.",
        });
      }
    }

    if (role && parseInt(role) === 1) {
      return res.status(400).json({
        success: false,
        message: "Sorry, you don't have permission to create an admin",
      });
    }

    // Prepare update object
    const updateObj = {};
    if (name) updateObj.name = name;
    if (username) updateObj.username = username;
    if (email) updateObj.email = email;
    if (role) updateObj.role = parseInt(role);

    // Update the user
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

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role || user.role === 1) {
      return res.status(400).json({
        success: false,
        message: "Sorry, you don't have permission to delete an admin",
      });
    }
    await User.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
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
