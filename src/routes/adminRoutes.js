const { Router } = require('express');
const router = Router();

const { permissionAddValidator } = require('../helper/adminValidator');
const { authenticate } = require('../middleware/authMiddleware');
const { addPermission } = require('../controllers/admin/permissionController');

router.post('/addPermission', authenticate, permissionAddValidator, addPermission);

module.exports = router