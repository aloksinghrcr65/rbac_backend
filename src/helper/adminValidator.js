const { check, param, query } = require('express-validator');

exports.permissionAddValidator = [
    check('permission_name', 'permission name is required').not().isEmpty()
];

exports.permissionUpdateValidator = [
    check('id', 'id is required').not().isEmpty(),
    check('permission_name', 'permission name is required').not().isEmpty()
];

exports.permissionDeleteValidator = [
    param('id').optional().isMongoId().withMessage('Invalid Permission ID format in URL.'),
    query('id').optional().isMongoId().withMessage('Invalid Permission ID format in query.'),
    check('id').optional().isMongoId().withMessage('Invalid Permission ID format in body.')
];

exports.roleAddValidator = [
    check('roleName', 'role name is required').not().isEmpty()
];


exports.addRouterPermissionValidator = [
    check('router_endpoint', 'router_endpoint is required').not().isEmpty(),
    check('role', 'role is required').not().isEmpty(),
    check('permission', 'permission must be an array form').isArray()
];

exports.getRouterPermissionsValidator = [
    check('router_endpoint', 'router_endpoint is required').not().isEmpty(),
]

