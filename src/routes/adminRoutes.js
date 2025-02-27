const { Router } = require('express');
const router = Router();

const { permissionAddValidator, permissionUpdateValidator, permissionDeleteValidator } = require('../helper/adminValidator');
const { authenticate } = require('../middleware/authMiddleware');
const { addPermission, getPermissions, updatePermission, deletePermission  } = require('../controllers/admin/permissionController');

router.post('/add-permission', authenticate, permissionAddValidator, addPermission);
router.get('/get-permissions', authenticate, getPermissions);
router.put('/update-permission', authenticate, permissionUpdateValidator, updatePermission);
router.delete('/delete-permission/:id?', authenticate, permissionDeleteValidator, deletePermission);

module.exports = router