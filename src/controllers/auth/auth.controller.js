const User = require('../../models/user.model');
const Permission = require('../../models/permission.model.js');
const UserPermissions = require('../../models/user-permission.model');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { generateAccessToken } = require('../../utils/jwt-utils');
const { getUserPermissions } = require('../../helper/helper.utils');

const userRegister = async (req, res) => {
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

        // assign default permissions
        const defaultPermissions = await Permission.find({
            is_default: 1
        });

        if (defaultPermissions.length > 0) {
            const permissionArray = [];
            defaultPermissions.forEach(permission => {
                permissionArray.push({
                    permission_name: permission.permission_name,
                    permission_value: [0, 1, 2, 3]
                })
            });
            const userPermissions = new UserPermissions({
                user_id: savedUser._id,
                permissions: permissionArray
            });

            var userPermissionsData = await userPermissions.save();
        }


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
                role: savedUser.role
            },
            permissions: userPermissionsData
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error. Please try again later.",
            error: error.message
        })
    }
};

const userLogin = async (req, res) => {
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

        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password. Please try again.",
            });
        }

        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password. Please try again.",
            });
        }

        const payload = {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        };

        // Generate JWT token
        const token = generateAccessToken(payload);

        // get user data with all permissions 
        const allPermissions = await User.aggregate([
            {
                $match: { email: payload.email }
            },
            {
                $lookup: {
                    from: "userpermissions",
                    localField: "_id",
                    foreignField: "user_id",
                    as: "permissions"
                }
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
                            then: { $arrayElemAt: [ "$permissions", 0 ]},
                            else: null
                        }
                    }
                }
            },
            {
                $addFields: {
                    "permissions": {
                        "permissions": "$permissions.permissions"
                    }
                }
            }
        ])

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            data: allPermissions[0]
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred. Please try again later.",
            error: error.message
        });
    }
};

const getProfile = async (req, res) => {
    try {
        const { id } = req.user;

        const user = await User.findById(id).select('-password -__v');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        };
        return res.status(200).json({
            success: true,
            message: "Fetched User Profile Successfully",
            user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error. Please try again later.",
            error: error.message
        })
    }
};

const getRefreshPermissions = async (req, res) => {
    try {
        const user_id = req.user.id;

        const userpermissions = await getUserPermissions(user_id);
        return res.status(200).json({
            success: true,
            message: "User Permissions",
            data: userpermissions
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}
module.exports = {
    userRegister,
    userLogin,
    getProfile, 
    getRefreshPermissions
}