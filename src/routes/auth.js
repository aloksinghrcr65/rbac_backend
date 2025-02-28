const { Router } = require('express');
const router = Router();

const { userRegister, userLogin, getProfile } = require('../controllers/auth/auth');
const { registerValidator, loginValidator } = require('../helper/authValidator');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/register', registerValidator, userRegister);
router.post('/login', loginValidator, userLogin);
router.get('/profile', authenticate, getProfile);

module.exports = router;