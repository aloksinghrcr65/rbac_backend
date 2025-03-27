const { Router } = require('express');
const router = Router();

const { userRegister, userLogin, getProfile, getRefreshPermissions } = require('../controllers/auth/auth.controller');
const { registerValidator, loginValidator } = require('../helper/validators/auth.validator');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/register', registerValidator, userRegister);
router.post('/login', loginValidator, userLogin);
router.get('/profile', authenticate, getProfile);
router.get('/refresh-permission', authenticate, getRefreshPermissions);

module.exports = router;