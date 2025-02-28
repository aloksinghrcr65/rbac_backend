const Role = require("../../models/Role");
const { validationResult } = require('express-validator');

const createRole = async (req, res) => {
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

    const { roleName, id } = req.body;

    const isNameExist = await Role.findOne({ roleName: {
        $regex: roleName,
        $options: 'i'
    } });
    if (isNameExist) {
      return res.status(409).json({
        success: false,
        message: "Role already exists",
      });
    }

    const roleObj = {
      roleName,
      value: id,
    };

    const role = new Role(roleObj);
    const roleData = await role.save();

    return res.status(500).json({
      success: true,
      message: "Roles created successfully",
      roles: roleData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
      error: error.message,
    });
  }
};

const getRoles = async (req, res) => {
  try {
    const roles = await Role.find().select('-__v').lean();
    if(!roles || roles.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No any roles found"
        })
    }

    return res.status(200).json({
        success: true,
        message: "Roles fetched successfully",
        roles
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
    createRole,
    getRoles
};
