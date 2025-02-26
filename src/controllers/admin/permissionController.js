const Permission = require('../../models/Permission');
const { validationResult } = require('express-validator');


const addPermission = async (req, res) => {
    try {
        // Validate request input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                success: false,
                message: "Validation failed. Please check the input fields.",
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

module.exports = { addPermission }
