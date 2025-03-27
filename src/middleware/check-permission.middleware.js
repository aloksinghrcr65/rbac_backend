const helper = require('../helper/helper.utils');

const checkPermission = async (req, res, next) => {
    try {
        if (req.user.role !== 1) { // role not be admin
            const routerPermission = await helper.getRouterPermission(req.path, req.user.role);
            const userPermission = await helper.getUserPermissions(req.user.id);

            if (userPermission.permissions.permissions === undefined || !routerPermission) {
                return res.status(400).json({
                    success: false,
                    message: "You haven't permission to access this route!"
                })
            }

            const permission_name = routerPermission.permission_id.permission_name;
            const permission_values = routerPermission.permission;

            const hasPermission = userPermission.permissions.permissions.some((permission) =>
                permission.permission_name = permission_name && 
                permission.permission_value.some(value => permission_values.includes(value))
            )

            if (!hasPermission) {
                return res.status(400).json({
                    success: false,
                    message: "You haven't permission to access this route!"
                })
            }
        }
        return next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        })
    }
};

module.exports = { checkPermission };