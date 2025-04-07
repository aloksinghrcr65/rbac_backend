const Role = require("../../models/role.model");

const createRoleService = async (roleName, id) => {
    const isNameExist = await Role.findOne({ roleName: { $regex: roleName, $options: 'i' } });
    if (isNameExist) {
        throw new Error("Role already exists");
    }

    const roleObj = { roleName, value: id };
    const role = new Role(roleObj);
    return await role.save();
};

const getRolesService = async () => {
    const roles = await Role.find().select('-__v').lean();
    if (!roles || roles.length === 0) {
        throw new Error("No roles found");
    }
    return roles;
};

module.exports = {
    createRoleService,
    getRolesService
};
