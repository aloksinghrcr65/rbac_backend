const Permission = require('../../models/Permission');
const { validationResult } = require('express-validator');


const addPermission = async (req, res) => {
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

        const { permission_name } = req.body;

        // Check if permission already exists
        const existingPermission = await Permission.findOne({ permission_name });
        if (existingPermission) {
            return res.status(409).json({
                success: false,
                message: "Permission already exists. Please use a different name.",
            });
        }

        let obj = { permission_name };

        if (req.body.default) {
            obj.is_default = parseInt(req.body.default);
        }

        const permission = new Permission(obj);
        await permission.save();

        return res.status(201).json({
            success: true,
            message: "Permission successfully created.",
            permission: {
                id: permission._id,
                permission_name: permission.permission_name,
                is_default: permission.is_default,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred. Please try again later.",
            error: error.message
        });
    }
};

const getPermissions = async (req, res) => {
    try {
        const permissions = await Permission.find().select('-__v');

        if (!permissions || permissions.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No permissions found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Permissions fetched successfully.",
            data: permissions
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error. Please try again later.",
            error: error.message
        });
    }
};

const updatePermission = async (req, res) => {
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

        const { id, permission_name } = req.body;

        if (!/^[0-9a-fA-F]{24}$/.test(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid permission ID format.",
            });
        }

        const isExists = await Permission.findById(id);
        if (!isExists) {
            return res.status(404).json({
                success: false,
                message: "Permission not found"
            })
        }

        const isNameAssigned = await Permission.findOne({
            _id: { $ne: id },
            permission_name
        });

        if (isNameAssigned) {
            return res.status(409).json({
                success: false,
                message: "This permission name already exist"
            })
        }

        let updatePermissionObj = {
            permission_name
        };

        if (req.body.default !== null) {
            updatePermissionObj.is_default = parseInt(req.body.default);
        }

        const updatedPermission = await Permission.findByIdAndUpdate(id, 
            { $set: updatePermissionObj }, { new: true, runValidators: true }).select('-__v');

        return res.status(201).json({
            success: true,
            message: "Permission updated successfully",
            permission: updatedPermission
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred. Please try again later.",
            error: error.message
        });
    }
};

const deletePermission = async (req, res) => {
    try {
        // // Validate request input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Invalid input data. Please check your request and try again.",
                errors: errors.array(),
            });
        }

        const { id } = req.params.id ? req.params : req.query.id ? req.query : req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Permission ID is required in the URL, query, or body.",
            });
        }

        if (!/^[0-9a-fA-F]{24}$/.test(id)) {
            return res.status(422).json({
                success: false,
                message: "Invalid permission ID format.",
            });
        }

        const permission = await Permission.findById(id);
        if (!permission) {
            return res.status(404).json({
                success: false,
                message: "Permission not found.",
            });
        }

        await Permission.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Permission deleted successfully."
        });

    } catch (error) {
        console.error("Error deleting permission:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error. Please try again later.",
            error: error.message
        });
    }
};

module.exports = { addPermission, getPermissions, updatePermission, deletePermission }
