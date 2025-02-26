const { check } = require('express-validator');

exports.permissionAddValidator = [
    check('permission_name', 'permission name is required').not().isEmpty()
];