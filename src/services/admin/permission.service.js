const Permission = require("../../models/permission.model");

exports.addPermission = async (permission_name, isDefault) => {
  try {
    // check if permission already exists
    const existingPermission = await Permission.findOne({
      permission_name: { $regex: permission_name, $options: "i" },
    });

    if (existingPermission) {
      return {
        success: false,
        status: 409,
        message: "Permission name already exists. Please use a different name.",
      };
    }

    let obj = { permission_name };
    if (isDefault !== null) {
      obj.is_default = parseInt(isDefault);
    }

    const permission = new Permission(obj);
    await permission.save();

    return {
      success: true,
      status: 201,
      message: "Permission created successfully",
      permission: {
        id: permission._id,
        permission_name: permission.permission_name,
        is_default: permission.is_default,
      },
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getPermissions = async () => {
  try {
    const permissions = await Permission.find().select("-__v");

    if (!permissions || permissions.length === 0) {
      return {
        success: false,
        status: 404,
        message: "No permissions found.",
      };
    }

    return {
      success: true,
      status: 200,
      message: "Permissions fetched successfully.",
      data: permissions,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.updatePermissions = async (id, permission_name, isDefault) => {
  try {
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return {
        success: false,
        status: 400,
        message: "Invalid permission ID format.",
      };
    }

    const isExists = await Permission.findById(id);
    if (!isExists) {
      return {
        success: false,
        status: 404,
        message: "Permission not found.",
      };
    }

    const isNameAssigned = await Permission.findOne({
      _id: { $ne: id },
      permission_name: { $regex: permission_name, $options: "i" },
    });

    if (isNameAssigned) {
      return {
        success: false,
        status: 409,
        message: "This permission name already exists.",
      };
    }

    let updatePermissionObj = { permission_name };
    if (isDefault !== null) {
      updatePermissionObj.is_default = parseInt(isDefault);
    }

    const updatedPermission = await Permission.findByIdAndUpdate(
      id,
      { $set: updatePermissionObj },
      { new: true, runValidators: true }
    ).select("-__v");

    return {
      success: true,
      status: 200,
      message: "Permission updated successfully.",
      permission: updatedPermission,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.deletePermission = async (id) => {
    try {
        if (!/^[0-9a-fA-F]{24}$/.test(id)) {
            return {
                success: false,
                status: 422,
                message: "Invalid permission ID format.",
            };
        }

        const permission = await Permission.findById(id);
        if (!permission) {
            return {
                success: false,
                status: 404,
                message: "Permission not found.",
            };
        }

        await Permission.findByIdAndDelete(id);

        return {
            success: true,
            status: 200,
            message: "Permission deleted successfully.",
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

