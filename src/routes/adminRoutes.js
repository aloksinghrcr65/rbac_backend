const { Router } = require('express');
const router = Router();

const { permissionAddValidator, permissionUpdateValidator, permissionDeleteValidator } = require('../helper/adminValidator');
const { authenticate } = require('../middleware/authMiddleware');
const { onlyAdminAccess } = require('../middleware/adminMiddleware');
const { addPermission, getPermissions, updatePermission, deletePermission  } = require('../controllers/admin/permissionController');

router.post('/add-permission', authenticate, onlyAdminAccess, permissionAddValidator, addPermission);
router.get('/get-permissions', authenticate, onlyAdminAccess, getPermissions);
router.put('/update-permission', authenticate, onlyAdminAccess, permissionUpdateValidator, updatePermission);
router.delete('/delete-permission/:id?', authenticate, onlyAdminAccess, permissionDeleteValidator, deletePermission);

module.exports = router